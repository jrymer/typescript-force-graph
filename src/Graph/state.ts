import { SimulationLinkDatum, SimulationNodeDatum, Selection } from "d3";

export type GraphItemTypes = "NODE" | "LINK";
interface GraphItem {
  id: string;
  type: GraphItemTypes;
}

export interface GraphNode extends GraphItem, SimulationNodeDatum {
  label: string;
  type: "NODE";
}

export interface GraphLink extends GraphItem, SimulationLinkDatum<GraphNode> {
  type: "LINK";
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export type SVGNode = Selection<SVGSVGElement, unknown, null, undefined>;
export type PositionContainer = Selection<
  SVGGElement,
  unknown,
  null,
  undefined
>;
export type D3Link = Selection<SVGLineElement, GraphLink, SVGGElement, unknown>;
export type D3Node = Selection<
  SVGCircleElement,
  GraphNode,
  SVGGElement,
  unknown
>;
