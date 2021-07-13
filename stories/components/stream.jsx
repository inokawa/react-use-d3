import React, { useEffect, useCallback } from "react";
import { useD3 } from "../../src";
import * as d3 from "d3";

const bumps = (() => {
  // Inspired by Lee Byron’s test data generator.
  function bump(a, n) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < n; ++i) {
      const w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return function bumps(n, m) {
    const a = [];
    for (let i = 0; i < n; ++i) a[i] = 0;
    for (let i = 0; i < m; ++i) bump(a, n);
    return a;
  };
})();

export const options = [
  { name: "d3.stackOffsetExpand", value: d3.stackOffsetExpand },
  { name: "d3.stackOffsetNone", value: d3.stackOffsetNone },
  { name: "d3.stackOffsetSilhouette", value: d3.stackOffsetSilhouette },
  {
    name: "d3.stackOffsetWiggle",
    value: d3.stackOffsetWiggle,
  },
];

const n = 20; // number of layers
const m = 200; // number of samples per layer
const k = 10; // number of bumps per layer
const z = d3.interpolateCool;

export default ({ width, height, mode }) => {
  const x = useCallback(d3.scaleLinear([0, m - 1], [0, width]), [width]);
  const y = useCallback(d3.scaleLinear([0, 1], [height, 0]), [height]);
  const area = useCallback(
    d3
      .area()
      .x((d, i) => x(i))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1])),
    [x, y]
  );
  const stack = useCallback(
    d3
      .stack()
      .keys(d3.range(n))
      .offset(options.find((o) => o.name === mode).value)
      .order(d3.stackOrderNone),
    [mode]
  );

  const randomize = useCallback(() => {
    const layers = stack(
      d3.transpose(Array.from({ length: n }, () => bumps(m, k)))
    );
    y.domain([
      d3.min(layers, (l) => d3.min(l, (d) => d[0])),
      d3.max(layers, (l) => d3.max(l, (d) => d[1])),
    ]);
    return layers;
  }, [y, stack]);

  const svg = useD3(
    (create) => d3.select(create("svg")).attr("viewBox", [0, 0, width, height]),
    [width, height]
  );
  const path = useD3(
    () =>
      svg
        .selectAll("path")
        .data(randomize)
        .join("path")
        .attr("d", area)
        .attr("fill", () => z(Math.random())),
    [svg, area, randomize]
  );

  useEffect(() => {
    (async () => {
      while (true) {
        await path
          .data(randomize)
          .transition()
          .delay(1000)
          .duration(1500)
          .attr("d", area)
          .end();
      }
    })();
    return () => {
      path.selectAll("*").interrupt();
    };
  }, [path, randomize]);

  return svg.node().toReact();
};
