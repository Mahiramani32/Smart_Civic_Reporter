// Wrap everything after DOM is ready
document.addEventListener('DOMContentLoaded', () => {

  // Simple JS HashMap class (wraps Map for clarity)
  class HashMap {
    constructor() { this.map = new Map(); }
    set(key, val) { this.map.set(key, val); }
    get(key) { return this.map.get(key); }
    has(key) { return this.map.has(key); }
    keys() { return Array.from(this.map.keys()); }
  }

  // Priority Queue (max-heap) for issues (compare returns positive when a > b)
  class PriorityQueue {
    constructor(compare) { this.data = []; this.compare = compare || ((a,b)=>a.priority - b.priority); }
    _swap(i,j){[this.data[i],this.data[j]]=[this.data[j],this.data[i]]}
    _parent(i){return Math.floor((i-1)/2)}
    _left(i){return 2*i+1}
    _right(i){return 2*i+2}
    push(item){ this.data.push(item); this._siftUp(this.data.length-1) }
    pop(){ if(!this.data.length) return null; const res=this.data[0]; const last=this.data.pop(); if(this.data.length){this.data[0]=last; this._siftDown(0);} return res }
    _siftUp(i){ while(i>0){ let p=this._parent(i); if(this.compare(this.data[i],this.data[p])>0){ this._swap(i,p); i=p } else break } }
    _siftDown(i){ while(true){ let l=this._left(i), r=this._right(i), largest=i; if(l<this.data.length && this.compare(this.data[l],this.data[largest])>0) largest=l; if(r<this.data.length && this.compare(this.data[r],this.data[largest])>0) largest=r; if(largest!==i){ this._swap(i,largest); i=largest } else break } }
    size(){return this.data.length}
  }

  // Graph (adj list) for clustering by location
  class Graph {
    constructor(){ this.adj = new Map(); }
    addNode(id){ if(!this.adj.has(id)) this.adj.set(id, new Set()); }
    addEdge(a,b){ this.addNode(a); this.addNode(b); this.adj.get(a).add(b); this.adj.get(b).add(a); }
    neighbors(id){ return this.adj.get(id)?Array.from(this.adj.get(id)):[] }
  }

  // Utilities
  function uuid(){ return 'id-'+Math.random().toString(36).slice(2,9) }

  const STORE_KEY = 'smart_civic_issues_v1';
  function loadIssues(){ const raw = localStorage.getItem(STORE_KEY); return raw?JSON.parse(raw):[] }
  function saveIssues(list){ localStorage.setItem(STORE_KEY, JSON.stringify(list)); }

  function computePriority(issue){
    const urgencyScore = { 'Electricity': 100, 'Water': 80, 'Streetlight': 60, 'Garbage': 40, 'Pothole': 20 };
    const likes = issue.likes || 0;
    const base = urgencyScore[issue.category] || 10;
    // Higher status should slightly increase priority (e.g., in-progress gets +10, resolved +20)
    const statusBonus = issue.status === 'In-progress' ? 10 : (issue.status === 'Resolved' ? 20 : 0);
    return base + likes * 5 + statusBonus;
  }

  // DOM helpers
  const pages = document.querySelectorAll('.page');
  function showPage(id){
    pages.forEach(p => p.id === id ? p.classList.add('active') : p.classList.remove('active'));
    if(id === 'home') renderStats();
    if(id === 'feed') renderFeed();
    if(id === 'admin') renderAdmin();
  }

  // Event bindings
  document.getElementById('reportBtn').onclick = () => showPage('report');
  document.getElementById('viewBtn').onclick = () => showPage('feed');
  document.getElementById('loginBtn').onclick = () => showPage('login');

  // Photo handling
  const photoInput = document.getElementById('photo');
  let lastPhotoDataUrl = "";
  photoInput.addEventListener('change', ev => {
    const f = ev.target.files[0];
    if(!f){ lastPhotoDataUrl = ""; return; }
    const reader = new FileReader();
    reader.onload = e => { lastPhotoDataUrl = e.target.result; };
    reader.readAsDataURL(f);
  });

  // Report form handler
  document.getElementById('reportForm').addEventListener('submit', e => {
    e.preventDefault();
    const issues = loadIssues();
    const id = uuid();
    const issue = {
      id,
      photo: lastPhotoDataUrl || "",
      location: document.getElementById('location').value || 'Unknown',
      category: document.getElementById('category').value,
      description: document.getElementById('description').value || '',
      likes: 0,
      status: 'Pending',
      timestamp: Date.now()
    };
    issue.priority = computePriority(issue);
    issues.push(issue);
    saveIssues(issues);
    // reset form
    document.getElementById('reportForm').reset();
    lastPhotoDataUrl = "";
    alert('Reported — thank you!');
    showPage('feed');
  });

  // Login save
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const user = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      role: document.getElementById('role').value
    };
    localStorage.setItem('smart_civic_user', JSON.stringify(user));
    alert('Saved!');
    showPage('home');
  });

  function renderStats(){
    const issues = loadIssues();
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    const statsEl = document.querySelector('.stats');
    if(statsEl) statsEl.innerText = `${total} issues reported, ${resolved} resolved`;
  }

  function renderFeed(){
    const issues = loadIssues();
    const sortBy = document.getElementById('sortBy').value;

    // Priority Queue: comparator returns positive if a has higher priority than b
    const pq = new PriorityQueue((a,b) => a.priority - b.priority);

    issues.forEach(i => { i.priority = computePriority(i); pq.push(i); });

    let ordered = [];
    if(sortBy === 'priority'){
      // pop until empty -> highest priority first
      while(pq.size()) ordered.push(pq.pop());
    } else if(sortBy === 'category'){
      ordered = issues.slice().sort((a,b) => a.category.localeCompare(b.category));
    } else if(sortBy === 'location'){
      // group by location (simple)
      const groups = {};
      issues.forEach(i => { groups[i.location] = groups[i.location] || []; groups[i.location].push(i); });
      ordered = [].concat(...Object.values(groups));
    }

    const container = document.getElementById('issuesList');
    container.innerHTML = '';
    ordered.forEach(issue => {
      const card = document.createElement('div'); card.className = 'card';
      card.innerHTML = `
        ${issue.photo ? `<img src="${issue.photo}" alt="photo" />` : ''}
        <h3>${issue.category}</h3>
        <p>${issue.description || ''}</p>
        <p><strong>Location:</strong> ${issue.location}</p>
        <p>Status: ${issue.status}</p>
        <button class="like">👍 ${issue.likes || 0}</button>
        <button class="details">Details</button>
      `;
      const likeBtn = card.querySelector('.like');
      const detailsBtn = card.querySelector('.details');

      likeBtn && (likeBtn.onclick = () => {
        // update likes
        issue.likes = (issue.likes || 0) + 1;
        issue.priority = computePriority(issue);
        const all = loadIssues().map(x => x.id === issue.id ? issue : x);
        saveIssues(all);
        renderFeed();
      });

      detailsBtn && (detailsBtn.onclick = () => showDetails(issue.id));
      container.appendChild(card);
    });
  }

  function showDetails(id){
    const issues = loadIssues();
    const issue = issues.find(i => i.id === id);
    if(!issue) return showPage('feed');
    showPage('details');
    const d = document.getElementById('issueDetails');
    d.innerHTML = `
      <div class="card">
        ${issue.photo ? `<img src="${issue.photo}" alt="photo" />` : ''}
        <h3>${issue.category}</h3>
        <p>${issue.description || ''}</p>
        <p><strong>Location:</strong> ${issue.location}</p>
        <p>Status: ${issue.status}</p>
        <p>Likes: ${issue.likes || 0}</p>
        <div class="timeline"><strong>Timeline</strong>
          <ol>
            <li>Reported</li>
            ${issue.status !== 'Pending' ? '<li>Acknowledged</li>' : ''}
            ${issue.status === 'Resolved' ? '<li>Resolved</li>' : ''}
          </ol>
        </div>
        <div style="margin-top:8px">
          <button id="markInProgress">Mark In-Progress</button>
          <button id="markResolved">Mark Resolved</button>
        </div>
      </div>
    `;
    const markInProgress = document.getElementById('markInProgress');
    const markResolved = document.getElementById('markResolved');

    if(markInProgress) markInProgress.onclick = () => {
      issue.status = 'In-progress';
      issue.priority = computePriority(issue);
      const all = loadIssues().map(x => x.id === issue.id ? issue : x);
      saveIssues(all);
      showDetails(issue.id);
    };
    if(markResolved) markResolved.onclick = () => {
      issue.status = 'Resolved';
      issue.priority = computePriority(issue);
      const all = loadIssues().map(x => x.id === issue.id ? issue : x);
      saveIssues(all);
      showDetails(issue.id);
    };
  }

  document.getElementById('backToFeed').onclick = () => showPage('feed');
  document.getElementById('sortBy').onchange = renderFeed;

  document.getElementById('exportReport').onclick = () => {
    const data = loadIssues();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'issues_report.json'; a.click();
    URL.revokeObjectURL(url);
  };

  function renderAdmin(){
    const issues = loadIssues();
    const pq = new PriorityQueue((a,b) => a.priority - b.priority);
    issues.forEach(i => { i.priority = computePriority(i); pq.push(i); });
    const top = [];
    while(pq.size() && top.length < 10) top.push(pq.pop());
    const container = document.getElementById('topIssues');
    container.innerHTML = '';
    top.forEach(issue => {
      const div = document.createElement('div'); div.className = 'card';
      div.innerHTML = `<h4>${issue.category} — ${issue.location}</h4>
                       <p>${issue.description || ''}</p>
                       <p>Priority: ${issue.priority}</p>
                       <button class="assign">Assign</button>`;
      container.appendChild(div);
    });
  }

  // initial
  showPage('home');
});
