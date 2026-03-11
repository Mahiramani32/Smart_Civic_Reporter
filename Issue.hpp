#ifndef ISSUE_HPP
#define ISSUE_HPP
#include <string>

struct Issue {
    std::string id;
    std::string photo;      
    std::string location;    
    std::string category;    
    std::string description;
    int likes = 0;
    std::string status = "Pending"; 
    long timestamp = 0;
    int priority = 0;
    std::string reporter = "Anonymous";
};

#endif