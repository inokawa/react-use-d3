import React, { useEffect, useState } from "react";
import { getRangedData } from "./util";
import { useD3 } from "../src/use-d3";

export default {
  title: "sample",
};

export const Div = () => {
  const [datas, setDatas] = useState<{ name: number; value: number }[]>(
    getRangedData(1000)
  );
  useEffect(() => {
    setInterval(() => {
      setDatas(getRangedData(100));
    }, 1000);
  }, []);

  const nodes = useD3(datas, (d, i) => <div>{i}</div>, {
    key: (d) => d.name,
    enter: (s) =>
      s
        .style("width", `0px`)
        .transition()
        .style("background", "green")
        .style("width", (d, i) => `${i * 10}px`),
    update: (s) =>
      s
        .transition()
        .style("background", "blue")
        .style("width", (d, i) => `${i * 10}px`),
    exit: (s) =>
      s
        .transition()
        .style("background", "red")
        .style("width", (d) => `0px`),
  });

  return <div>{nodes}</div>;
};
