#include <iostream>
#include <ctime>
#include <string>
#include "Issue.hpp"
#include "HashMap.hpp"
#include "Graph.hpp"
#include "PriorityQueue.hpp"

// small helper to compute priority in C++ (same logic as JS)
int computePriority(const Issue &issue) {
    int base = 10;
    if(issue.category == "Electricity") base = 100;
    else if(issue.category == "Water") base = 80;
    else if(issue.category == "Streetlight") base = 60;
    else if(issue.category == "Garbage") base = 40;
    else if(issue.category == "Pothole") base = 20;
    int statusBonus = (issue.status == "In-progress" ? 10 : (issue.status == "Resolved" ? 20 : 0));
    return base + issue.likes * 5 + statusBonus;
}

int main(){
    std::cout << "C++ DSA Demo for Smart Civic Reporter\n\n";

    // create a few issues
    Issue a; a.id = "i1"; a.location = "Main St"; a.category = "Pothole"; a.description = "Large pothole near #12"; a.likes = 2; a.timestamp = std::time(nullptr);
    Issue b; b.id = "i2"; b.location = "Main St"; b.category = "Garbage"; a.likes = 1; b.description = "Garbage heap near market"; b.likes = 5; b.timestamp = std::time(nullptr);
    Issue c; c.id = "i3"; c.location = "2nd Ave"; c.category = "Electricity"; c.description = "Power outage block B"; c.likes = 1; c.timestamp = std::time(nullptr);

    a.priority = computePriority(a);
    b.priority = computePriority(b);
    c.priority = computePriority(c);

    // HashMap usage
    HashMap hm;
    hm.put(a.location, a);
    hm.put(b.location, b);
    hm.put(c.location, c);

    std::cout << "HashMap contents (grouped by location):\n";
    for(auto &p : hm.map) {
        std::cout << "Location: " << p.first << " -> " << p.second.size() << " issue(s)\n";
    }
    std::cout << "\n";

    // Graph: connect issues that share the same location
    Graph g;
    g.addEdge(a.location, b.location); // same in demo; in real use you'd connect issues by coordinates/nearby
    g.addEdge(b.location, c.location);

    std::cout << "Graph adjacency:\n";
    g.print();
    std::cout << "\n";

    // Priority Queue
    PriorityQueue pq;
    pq.push(a); pq.push(b); pq.push(c);

    std::cout << "Popping issues by priority (highest first):\n";
    while(!pq.empty()){
        Issue top = pq.pop();
        std::cout << "Issue " << top.id << " | category: " << top.category << " | location: " << top.location
                  << " | likes: " << top.likes << " | priority: " << top.priority << "\n";
    }

    std::cout << "\nDemo finished.\n";
    return 0;
}