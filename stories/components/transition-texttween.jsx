import React, { useEffect } from "react";
import { useD3 } from "../../src";
import * as d3 from "d3";

export const TweenNumber = () => {
  const div = useD3((create) => {
    return d3
      .select(create("div"))
      .style("font-family", "sans-serif")
      .style("font-variant-numeric", "tabular-nums");
  }, []);

  useEffect(() => {
    (async () => {
      while (true) {
        await div
          .transition()
          .duration(5000)
          .textTween(() => (t) => `t = ${t.toFixed(6)}`)
          .end();
      }
    })();
    return () => div.selectAll("*").interrupt();
  }, [div]);

  return div.node().toReact();
};

const random = d3.randomUniform(1e5, 1e7);
const format = d3.format(".3s");

export const TweenFormattedNumber = () => {
  const div = useD3((create) => {
    return d3
      .select(create("div"))
      .style("font-family", "sans-serif")
      .style("font-variant-numeric", "tabular-nums")
      .property("_current", random);
  }, []);

  useEffect(() => {
    (async () => {
      while (true) {
        await div
          .datum(random)
          .transition()
          .duration(5000)
          .textTween(function (d) {
            const i = d3.interpolate(this._current, d);
            return function (t) {
              return format((this._current = i(t)));
            };
          })
          .end();
      }
    })();
    return () => div.selectAll("*").interrupt();
  }, [div]);

  return div.node().toReact();
};

export const TweenTextAppearance = () => {
  const div = useD3((create) => {
    return d3
      .select(create("div"))
      .style("font-family", "var(--sans-serif)")
      .style("position", "relative")
      .text("before");
  }, []);

  useEffect(() => {
    (async () => {
      while (true) {
        await div
          .append("div")
          .style("position", "absolute")
          .style("top", 0)
          .style("left", 0)
          .style("bottom", 0)
          .style("right", 0)
          .style("background-color", "white")
          .style("opacity", 0)
          .text("after")
          .transition()
          .delay(1250)
          .duration(2500)
          .style("opacity", 1)
          .transition()
          .duration(1250)
          .end();
      }
    })();
    return () => div.selectAll("*").interrupt();
  }, [div]);

  return div.node().toReact();
};
