import { generateNode, generateLink } from "./utils";
import { GraphData } from "./state";

export const data: GraphData = {
  nodes: [
    generateNode(1, "Frodo"),
    generateNode(2, "Aragorn"),
    generateNode(3, "Elrond"),
    generateNode(4, "Gandalf"),
    generateNode(5, "Saruman"),
    generateNode(6, "Sauron"),
    generateNode(7, "Legolas"),
    generateNode(8, "Treebeard"),
  ],
  links: [
    generateLink(1, 1, 2),
    generateLink(2, 1, 4),
    generateLink(3, 1, 7),
    generateLink(4, 1, 3),
    generateLink(5, 2, 3),
    generateLink(6, 2, 4),
    generateLink(7, 2, 7),
    generateLink(8, 3, 4),
    generateLink(9, 3, 5),
    generateLink(10, 3, 7),
    generateLink(11, 4, 8),
    generateLink(12, 4, 5),
    generateLink(13, 5, 6),
  ],
};
