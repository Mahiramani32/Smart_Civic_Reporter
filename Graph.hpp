#ifndef GRAPH_HPP
#define GRAPH_HPP

#include <string>
#include <unordered_map>
#include <vector>
#include <unordered_set>
#include <iostream>

using namespace std; 

class Graph {
public:
    unordered_map<string, unordered_set<string>> adj;

    void addNode(const string &id) {
        adj.emplace(id, unordered_set<string>{});
    }

    void addEdge(const string &a, const string &b) {
        addNode(a);
        addNode(b);
        adj[a].insert(b);
        adj[b].insert(a);
    }

    vector<string> neighbors(const string &id) const {
        vector<string> out;
        auto it = adj.find(id);
        if (it != adj.end()) {
            for (const auto &n : it->second) {
                out.push_back(n);
            }
        }
        return out;
    }

    void print() const {
        for (const auto &p : adj) {
            cout << p.first << " -> ";
            for (const auto &n : p.second) {
                cout << n << ", ";
            }
            cout << "\n";
        }
    }
};

#endif 
