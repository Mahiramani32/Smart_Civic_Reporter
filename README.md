# Smart_Civic_Reporter

## How to Run the Project

1. Clone the repository
git clone https://github.com/Mahiramani32/Smart_Civic_Reporter.git

2. Open the project folder

3. Open the file `index.html` in any web browser
   (Chrome, Edge, Firefox, etc.)

4. The Smart Civic Reporter website will load and you can start exploring the features.


# Smart Civic Issue Reporting System

A web-based platform that allows residents to report and track local civic issues such as potholes, garbage dumps, streetlight outages, water leaks, and electricity problems. The system prioritizes issues based on urgency and community votes to help municipal authorities address the most critical problems first.

## Features

- Residents can report issues by uploading a photo, location, and description
- Categorization of issues (Pothole, Garbage, Streetlight, Water, Electricity)
- Like/vote system to highlight important issues
- Issue status tracking (Pending, In Progress, Resolved)
- Priority-based sorting of issues for authorities
- Location-based grouping of nearby issues

## Data Structures Used

**Hash Map**
- Stores issues by location for fast lookup.

**Graph**
- Connects issues based on geographical proximity to identify clusters.

**Priority Queue**
- Sorts issues by urgency and number of user votes to determine priority.

## Tech Stack

Frontend:
- HTML
- CSS
- JavaScript

Concepts:
- Hash Map
- Graph
- Priority Queue

## Project Workflow

1. User reports an issue with photo, location, and description.
2. The issue is stored in the system using a Hash Map.
3. Nearby issues are connected using a Graph structure.
4. Issues are ranked using a Priority Queue.
5. Authorities can view high-priority issues first and update their status.

## Future Improvements

- Google Maps API integration for accurate location tracking
- Real-time notifications
- Mobile application support
- AI-based image classification for issue detection

## Author

Mahi Ramani  
B.Tech Computer Science Engineering  
Nirma University
