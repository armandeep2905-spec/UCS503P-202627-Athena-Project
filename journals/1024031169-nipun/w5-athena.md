# Week 5 — Project Prototype Report and 2D Navigation Development

## Problem / Challenge

This week, the development work focused on two areas of the Athena project. The first was preparing the Project Prototype Report with the required software engineering diagrams and documentation. The second was continuing the 2D campus navigation system, where problems were still occurring while finding valid routes between some locations.

The main navigation challenge was that the shortest-path algorithm could calculate a route only when the locations and road connections were correctly represented. Some start-to-destination combinations were still producing incorrect or unavailable routes.

## Relevant Context

The Project Prototype Report was prepared to document the software engineering design of Athena.

The report included: Use Case / UML Design, Activity Diagram, Class Diagram, SDLC Model


For navigation, the existing 2D campus map was further developed using campus locations, coordinates, road nodes and graph connections.

## Solution

The prototype report was created in LaTeX and included the major software engineering diagrams required for the project.

For navigation, the implementation was modified to use a road-network graph instead of directly connecting the starting and destination coordinates.

The shortest-path approach was then used to calculate a route through the available road nodes.

## Work Completed

During this week, the following work was completed:

1. Created the Project Prototype Report in LaTeX.
2. Added the required software engineering diagrams, including Use Case, UML, Activity, Class and SDLC diagrams.
3. Resumed development of the 2D campus navigation map.
4. Modified the route calculation logic to use the campus graph.
5. Added shortest-path calculation between selected locations.
6. Updated route visualization to display intermediate road nodes.
7. Tested routes between different starting and destination locations.

## Problems Faced

Incorrect Route Detection for Some Locations
```text
Uncaught TypeError: Cannot read properties of undefined (reading 'push')
    at connectRoads (script.js:XXX)
    at script.js:XXX
    at script.js:XXX
```
While testing the navigation system, some start-to-destination combinations were still not producing the expected route.

The earlier implementation had coding issues in the road-node and location connections. For example, the road graph contained connections based on the previous node structure, while the road-node coordinates and location mappings were later changed.

This resulted in incorrect or missing paths for some locations.

The issue was therefore not only with the shortest-path calculation itself, but also with how the campus roads and locations were connected in the graph.

## Testing

The navigation system was tested using different combinations of starting and destination locations.

The testing focused on:

-> Whether the selected locations were correctly identified.

-> Whether the locations were connected to the appropriate road nodes.

-> Whether a valid graph path existed between the two locations.

-> Whether the shortest-path algorithm could find the route.


Some routes were successfully calculated, while certain location combinations still showed incorrect route detection.

## Current Progress

The Project Prototype Report has been prepared with the required software engineering diagrams.

The 2D navigation system has also progressed from direct coordinate-based routing towards graph-based shortest-path navigation. The current implementation can successfully calculate and visualize routes for some locations, but the campus road network and location connections still require refinement.

## Next Step

The next stage will focus on correcting the remaining road-node and location connections so that valid paths can be discovered for more start-to-destination combinations.

Further testing will be performed using different campus locations, and the shortest-path implementation will be refined to improve route discovery.

After the 2D navigation becomes stable, the project can be extended towards the planned 3D navigation component of Athena.
