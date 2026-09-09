# Week 4 — 2D Campus Navigation and Route Calculation

## Problem / Challenge

After completing the initial database and repository setup, the next development task was to begin implementing the campus navigation component of Athena.

The objective was to create an initial 2D representation of the campus and allow navigation between different campus locations.The main challenge was that simply assigning coordinates to locations is not sufficient for navigation. A system was also required to represent the actual connections between locations.

Therefore, the navigation system needed to be represented as a graph rather than calculating a direct line between two locations.

## Relevant Context
The initial 2D navigation system represents campus locations using coordinates. Each location acts as a node in the campus navigation system.

However, the locations must also be connected according to valid campus routes.

The navigation system requires two separate components:
```javascript
Campus Coordinates
        +
Campus Graph Connections
        ↓
Route Calculation
        ↓
Route Visualization
```

## Solution

The 2D navigation system was developed by defining:

1. Campus locations.
2. Coordinates for each location.
3. Connections between valid locations.
4. Distance values for connected locations.
5. A route calculation mechanism.
6. A method for displaying the calculated route on the map.

The structure allows the navigation system to determine which locations are directly connected.

## Work Completed

During this week, the following work was completed:

1. Added campus locations to the 2D map.
2. Defined coordinates for campus locations.
3. Represented locations as nodes.
3. Defined valid connections between locations.
4. Represented the campus structure as a graph.
5. Added distance values between connected locations.
6. Implemented route calculation between selected locations.
7. Displayed the calculated route on the map.
8. Tested navigation between different campus locations.


## Problems Faced
> Direct Diagonal Route Display

During route visualization, a direct line could be drawn between two locations.

Conceptually:
```javascript
Start
   \
    \
     \
      Destination
```

This does not represent the actual route that a student, cyclist or vehicle can follow.

The problem occurred because the visualization was based directly on the start and destination coordinates instead of following intermediate nodes in the graph.

## Testing

The tests focused on checking:

1. Whether both locations were correctly identified.
2. Whether a valid connection existed between the locations.
3. Whether intermediate nodes were included when required.
4. Whether the calculated route followed the campus graph.
5. Whether the route was displayed correctly on the 2D map.

## Current Progress

The initial implementation of the 2D navigation system is in progress.

The current system provides the foundation for selecting locations, representing the campus as a graph and calculating routes.

The next development stage will focus on making navigation more useful for different modes of movement.

## Next Step

The next stage of development will include allowing the user to select:
```javascript
Start Location
        +
Destination
        +
Travel Mode
```

The possible travel modes will include: Walking, Bicycle, Car

The navigation system will then determine an appropriate route based on the selected travel mode.The route calculation will later be extended so that the shortest valid route can be highlighted according to the selected mode of transportation. Further we can progress to 3D navigation in Athena.
