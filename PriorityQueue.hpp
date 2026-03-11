#ifndef PRIORITYQUEUE_HPP
#define PRIORITYQUEUE_HPP

#include "Issue.hpp"
#include <queue>
#include <vector>
#include <functional>

class PriorityQueue {
public:
    struct Comp {
        bool operator()(Issue const &a, Issue const &b) const {
           
            return a.priority < b.priority;
        }
    };

    std::priority_queue<Issue, std::vector<Issue>, Comp> pq;

    void push(const Issue &it) { pq.push(it); }
    bool empty() const { return pq.empty(); }
    Issue pop() { Issue t = pq.top(); pq.pop(); return t; }
    size_t size() const { return pq.size(); }
};

#endif