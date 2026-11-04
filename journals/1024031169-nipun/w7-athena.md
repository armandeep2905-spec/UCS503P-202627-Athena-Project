# Week 7 — Campus Road Connectivity and Route Accuracy Improvements

## Problem / Challenge

This week, the development work focused on improving the road network of Athena's 2D campus navigation system. Although dynamic road snapping and edge splitting were introduced in Week 6, some road segments and junctions were still not properly connected.

The main challenge was ensuring that the campus road network was represented accurately in the graph so that every tested location could be reached through connected pathways. Missing or incorrect connections caused route failures and unnecessary detours.

## Problems Faced

### 1. Disconnected Road Segments

```text
No route available between these locations.
```

Some road segments appeared connected on the map but were represented as separate graph components. As a result, the pathfinding algorithm could not travel between certain areas.

### 2. Invalid Road-Node Reference

```text
TypeError: Cannot read properties of undefined (reading 'x')
```

During road-network refinement, a connection referenced a road-node ID that was not present in the coordinate dictionary. When the route calculation attempted to access the node's coordinates, it encountered an undefined value.

### 3. Incorrect Route Geometry

Some routes included unnecessary detours because the road graph contained incomplete junction connections or links that did not accurately represent the campus pathways.

## Solution

1. **Road-network refinement:** Reviewed the campus road chains and corrected missing or inaccurate connections.
2. **Graph connectivity:** Connected road segments through their appropriate junctions so that the pathfinder could traverse the complete network.
3. **Node validation:** Checked road-node references against the coordinate dictionary before adding graph edges.
4. **Route testing:** Tested different start and destination combinations to identify disconnected areas and verify route availability.
5. **Path accuracy:** Corrected road links that caused unnecessary detours and ensured that calculated routes followed the mapped pathways.

These improvements made the campus road graph more complete and consistent. Route calculation became more reliable for the tested locations, with further validation continuing as the campus map is refined.
