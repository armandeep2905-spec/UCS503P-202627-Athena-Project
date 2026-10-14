# Week 6 — Campus Road-Network Overhaul and Navigation Logic Redesign

## Problem / Challenge

This week, the focus was on redesigning Athena's 2D campus navigation system by migrating from the previous navigation to the new implementation.

The old system relied on fixed road-node connections, which caused route failures and paths cutting through buildings. Canvas scaling and inconsistent location keys also caused rendering and route calculation errors.

## Problems Faced

### 1. Location Mapping Error

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'x')
```

Manually entered dropdown values such as `"H block"` did not match JavaScript keys such as `h_block`, causing route calculation to fail.

### 2. Canvas Rendering Error

```text
Uncaught TypeError: Cannot read properties of null (reading 'getContext')
```

The Canvas overlay had rendering and scaling issues when the map dimensions changed or the canvas element was unavailable.

### 3. Rigid Road Connections

```text
No route available between these locations.
```

Buildings were connected to fixed road junctions. This caused some routes to fail or take unrealistic paths across buildings and lawns.


## Solution

1. **Dynamic location mapping:** Generated dropdowns from a single location data source to prevent mismatched keys.
2. **Dynamic road snapping:** Replaced fixed building-to-node connections with nearest-road projection and edge splitting. Temporary snap nodes connect buildings to the closest road segment.
3. **Improved pathfinding:** Separated routes into a walking connector, a road-network path, and an ending walking connector, helping routes follow campus roads.
4. **SVG rendering:** Replaced Canvas with an SVG overlay using `viewBox` to maintain route alignment across screen sizes.
5. **Graph safety:** Initialized adjacency lists before adding edges to prevent errors involving `push`.
6. **Navigation features:** Added compass-based turn-by-turn directions, nearby landmarks, map-click selection, zoom and pan, route swapping, and road-network visualization.


These changes redesigned the underlying route calculation and map-rendering logic, making Athena's 2D campus navigation more structured and usable. Further testing is needed to verify all road connections and routes.
