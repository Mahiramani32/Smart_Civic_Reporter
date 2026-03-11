#include "Graph.hpp"

int main() {
    Graph g;
    g.addEdge("A", "B");
    g.addEdge("A", "C");
    g.addEdge("B", "D");

    g.print();
    return 0;
}