import { GraphLink, GraphNode } from "./state";

export const generateNode = (id: number, label: string): GraphNode => ({
  id: id.toString(),
  label,
  type: "NODE",
});

export const generateLink = (
  id: number,
  source: number,
  target: number
): GraphLink => ({
  id: id.toString(),
  type: "LINK",
  source: source.toString(),
  target: target.toString(),
});

/**
 * Checks to see if an item is of type GraphNode. Used mostly in the reducer for determining if a line's source and target are nodes yet, as when a line is being created it doesn't have either.
 * A GraphLink extends D3's SimulationLinkDatum which states the source and target are a union of SomeDatum | string | number
 * @param {string | number | GraphNode | GraphLink} item
 * @returns boolean
 */
export const isGraphNode = (
  item: string | number | GraphNode | GraphLink
): item is GraphNode => {
  return (
    typeof item !== "string" && typeof item !== "number" && item.type === "NODE"
  );
};

/**
 * Because a link's source and target node can be strings, instead of type casting everywhere this function type safely finds a link's node's x or y positions.
 * @param link
 * @param key source or target
 * @param position x or y
 * @returns
 */
export const getXOrY = (
  link: GraphLink,
  key: "source" | "target",
  position: "x" | "y"
): number => {
  const typedLink = link[key];
  if (isGraphNode(typedLink)) {
    const positionValue = typedLink[position];
    return positionValue ? positionValue : 0;
  }
  return 0;
};
