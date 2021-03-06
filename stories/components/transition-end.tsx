import React, { useEffect } from "react";
import { useD3 } from "../../src";
import * as d3 from "d3";

const w = 640;
const r = 32;
const h = r * 3;

export default () => {
  const [svg, circle] = useD3((create) => {
    const svg = d3.select(create("svg")).attr("viewBox", [0, 0, w, h]);

    const circle = svg
      .append("circle")
      .attr("r", r)
      .attr("cx", w + r)
      .attr("cy", h / 2)
      .attr("fill", "transparent")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    return [svg, circle];
  }, []);

  useEffect(() => {
    (async () => {
      await circle
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("fill", "yellow")
        .attr("cx", r)
        .end();

      while (true) {
        await circle
          .transition()
          .duration(2000)
          .attr("fill", `hsl(${Math.random() * 360},100%,50%)`)
          .attr("cx", Math.random() * (w - r * 2) + r)
          .end();
      }
    })();
    return () => {
      circle.selectAll("*").interrupt();
    };
  }, []);

  return svg.node().toReact();
};
