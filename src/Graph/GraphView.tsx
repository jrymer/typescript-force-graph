import { useEffect, useRef } from "react";
import { data } from "./data";
import { generateGraph } from "./generateGraph";

export const GraphView = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && svgRef.current) {
      const { draw } = generateGraph(svgRef.current, data);
      draw();
    }
  }, []);

  return <svg height="100%" width="100%" ref={svgRef} />;
};
