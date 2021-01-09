import React, { useEffect, useState } from "react";
import { useD3 } from "../src/use-d3";

export default {
  title: "text",
};

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ALPHABETS = "abcdefghijklmnopqrstuvwxyz".split("");

export const Letters = () => {
  const [datas, setDatas] = useState<string[]>(ALPHABETS);
  useEffect(() => {
    setInterval(() => {
      setDatas(
        shuffle(ALPHABETS)
          .slice(0, Math.floor(Math.random() * 26))
          .sort()
      );
    }, 1000);
  }, []);
  const [nodes] = useD3(datas, (d, i) => <text>{d}</text>, {
    key: (d) => d,
    enter: (s) =>
      s
        .attr("fill", "green")
        .attr("x", (d, i) => i * 20)
        .attr("y", -20)
        .attr("fill-opacity", 0)
        .transition()
        .attr("y", 0)
        .attr("fill-opacity", 1),
    update: (s) =>
      s
        .attr("fill", "#333")
        .transition()
        .attr("x", (d, i) => i * 20)
        .attr("y", 0),
    exit: (s) =>
      s
        .attr("fill", "brown")
        .transition()
        .attr("y", 20)
        .attr("fill-opacity", 0),
  });
  return (
    <svg width="600" height="400">
      <g transform={`translate(${25},${50})`}>{nodes}</g>
    </svg>
  );
};

// https://observablehq.com/@d3/transition-texttween?collection=@d3/d3-transition
export const TextTween = () => {
  const [nodes, update] = useD3(
    ["dummy"],
    (d, i) => (
      <div
        style={{
          fontFamily: "var(--sans-serif)",
          fontVariantNumeric: "tabular-nums",
        }}
      />
    ),
    { key: (d) => d }
  );
  useEffect(() => {
    update((s) => {
      s.transition()
        .duration(5000)
        .textTween(() => (t) => `t = ${t.toFixed(6)}`)
        .end();
    });
  }, []);
  return nodes;
};
