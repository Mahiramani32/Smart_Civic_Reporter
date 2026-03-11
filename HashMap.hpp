
#ifndef HASHMAP_HPP
#define HASHMAP_HPP

#include "Issue.hpp"
#include <string>
#include <vector>
#include <unordered_map>

using namespace std; 

class HashMap {
public:
    
    unordered_map<string, vector<Issue>> map;

    void put(const string &location, const Issue &issue) {
        map[location].push_back(issue);
    }

    vector<Issue> &get(const string &location) {
        return map[location]; 
    }

    bool has(const string &location) const {
        return map.find(location) != map.end();
    }

    vector<string> keys() const {
        vector<string> result;
        for (const auto &pair : map) {
            result.push_back(pair.first);
        }
        return result;
    }
};

#endif // HASHMAP_HPP
