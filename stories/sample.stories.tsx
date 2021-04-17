import React, { useEffect, useState } from "react";
import { useD3, d3Element } from "../src";
import * as d3 from "d3";

export default {
  title: "sample",
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

  const [e, graph] = useD3(() => {
    const el = d3Element("svg");
    const svg = d3.select(el).attr("width", 600).attr("height", 400);
    const graph = svg.append("g").attr("transform", `translate(${25},${50})`);
    return [el, graph];
  }, []);
  useD3(() => {
    const t = graph.transition().duration(750);
    // join
    const text = graph.selectAll("text").data(datas, (d) => d);
    // update
    text
      .attr("class", "update")
      .transition(t)
      .attr("x", (d, i) => i * 20)
      .attr("y", 0);
    // enter
    text
      .enter()
      .append("text")
      .text((d) => d)
      .attr("class", "enter")
      .attr("x", (d, i) => i * 20)
      .attr("y", -20)
      .attr("fill-opacity", 0)
      .transition(t)
      .attr("y", 0)
      .attr("fill-opacity", 1);
    // exit
    text
      .exit()
      .attr("class", "exit")
      .transition(t)
      .attr("y", 20)
      .attr("fill-opacity", 0)
      .remove();
  }, [graph, datas]);
  return (
    <div>
      {e.toReact()}
      <style>
        {`
      text {
        font: bold 28px monospace;
      }
      
      .enter {
        fill: green;
      }
      
      .update {
        fill: #333;
      }
      
      .exit {
        fill: brown;
      }
      `}
      </style>
    </div>
  );
};
