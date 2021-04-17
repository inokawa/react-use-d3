import React, { useEffect } from "react";
import { useD3, d3Element } from "../src";
import * as d3 from "d3";

const n = 4002;

const whiteblue = d3.interpolateRgb("#eee", "steelblue");
const blueorange = d3.interpolateRgb("steelblue", "orange");
const orangewhite = d3.interpolateRgb("orange", "#eee");

export default () => {
  const [div] = useD3(() => {
    const div = d3.select(d3Element("div"));
    div
      .selectAll("div")
      .data(d3.range(n))
      .enter()
      .append("div")
      .attr("class", "square")
      .transition()
      .delay((d, i) => i + (Math.random() * n) / 4)
      .ease(d3.easeLinear)
      .on("start", function repeat() {
        d3.active(this)
          .styleTween("background-color", () => whiteblue)
          .transition()
          .delay(1000)
          .styleTween("background-color", () => blueorange)
          .transition()
          .delay(1000)
          .styleTween("background-color", () => orangewhite)
          .transition()
          .delay(n)
          .on("start", repeat);
      });
    return [div];
  }, []);

  return (
    <div style={{ maxWidth: 960 }}>
      {div.node().toReact()}
      <style>
        {`
.square {
  width: 10px;
  height: 10px;
  margin: 1px 0 0 1px;
  float: left;
  background: #eee;
  display: inline-block;
}
`}
      </style>
    </div>
  );
};
