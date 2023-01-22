import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
} from "d3";
import { MutableRefObject } from "react";
import {
  D3Link,
  D3Node,
  GraphData,
  GraphLink,
  GraphNode,
  PositionContainer,
} from "./state";
import { getXOrY } from "./utils";

export const generateGraph = (
  container: MutableRefObject<SVGSVGElement>["current"],
  data: GraphData
) => {
  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;
  // Our simluation will be applying its forces to our GraphNodes and GraphLinks.
  let simulation = forceSimulation<GraphNode, GraphLink>();
  let graphData = data;

  // Take our SVG from GraphView.tsx and use it's ref we passed in to set that as our
  // base element for the graph
  const svg = select(container)
    .attr("id", "graph-container")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  /**
   * Accepts new graph data to redraw the graph with.
   * @param newData Data to redraw our graph with
   */
  const setData = (newData: GraphData) => {
    graphData = newData;
  };

  /**
   * Draws the graph.
   */
  const draw = () => {
    // Because we're running in strict mode, React runs through the render cycle twice
    // This causes our <g/> container to be appended to our <svg/> twice. So clear
    // the graph every time we redraw.
    svg.selectAll("*").remove();
    // Create our force simulation
    simulation = forceSimulation<GraphNode, GraphLink>()
      .nodes(graphData.nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(graphData.links)
          .id((d) => d.id)
          // Set the distance of the lines the graph draws
          .distance(20)
      )
      // Set the center of gravity for all of our forces
      .force("center", forceCenter(0, 0))
      // Set the radius of the collision force. Usually want to to set it to at least the diameter
      // of our nodes
      .force("collide", forceCollide().radius(10))
      // The strength of the repulsion force. Negative numbers repel, positives attract, we want to repel our nodes
      .force("charge", forceManyBody().strength(-100))
      // Forces the simulation to "cool" a tad sooner, a very minute amount of adjustments will run for about a second or two if
      // this is removed.
      .alphaMin(0.04);

    // All of our graph items will be slapped onto this positional container. This is because of panning and zooming, which we will cover in the future
    const g: PositionContainer = svg
      .append("g")
      .attr("id", "position-container");

    const { link } = drawLines(g, graphData);
    const node = drawNodes(g, graphData);

    /**
     *  For every tick of the simluation, set the positional attributes of our graph items
     *  x1-y2 for lines, and cx and cy for our nodes.
     *
     * For lines:
     *  x1: x coord of source node our line is starting from
     *  x2: x coord of target node our line is ending at
     *  y1: y coord of source node our line is starting from
     *  y2: y coord of target node our line is ending at
     *
     * For nodes:
     *  cx: x coord of center of our node
     *  cy: y coord of center of our node
     */
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => getXOrY(d, "source", "x"))
        .attr("y1", (d) => getXOrY(d, "source", "y"))
        .attr("x2", (d) => getXOrY(d, "target", "x"))
        .attr("y2", (d) => getXOrY(d, "target", "y"));

      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);
    });
  };

  return { draw, setData };
};

function drawLines(
  g: PositionContainer,
  graphData: GraphData
): { link: D3Link } {
  // Take our positional container <g/> and append another <g/> to it
  // this will house all our links
  const links = g.append("g").attr("id", "links");
  // Grab the links container, and append a <line/> for every line in our graph data
  const link: D3Link = links
    .selectAll("#links")
    .data(graphData.links)
    .enter()
    .append("line")
    .attr("id", (d) => d.id)
    .attr("stroke", "#000");

  return { link };
}

function drawNodes(g: PositionContainer, graphData: GraphData): D3Node {
  // Take our positional container <g/> and append another <g/> to it
  // this will house all our nodes
  const nodes = g.append("g").attr("id", "nodes");
  // Grab the nodes container, and append a <circle/> for every node in our graph data
  const node: D3Node = nodes
    .selectAll("#nodes")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("id", (d) => d.id)
    .attr("r", 5);

  return node;
}
