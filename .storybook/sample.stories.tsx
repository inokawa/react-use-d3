import React, { useEffect, useState } from "react";
import { Select } from "../src";
import { getRangedData } from "./util";
import * as d3 from "d3";

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
  const [focused, setFocused] = useState<number | null>(null);

  return (
    <Select onEnter={(t) => t}>
      {datas.map((d) => (
        <div
          key={d.name}
          style={{
            width: `${d.value}px`,
            background: d.name === focused ? "orange" : "steelblue",
          }}
          onClick={() => alert(d.value)}
          onMouseEnter={() => {
            setFocused(d.name);
          }}
          onMouseLeave={() => {
            setFocused(null);
          }}
        >
          {d.value}
        </div>
      ))}
    </Select>
  );
};

export const Text = () => {
  return <Select>aaa</Select>;
};

const Comp = (props: any) => {
  return <span>{props.children}</span>;
};
export const Component = () => {
  return (
    <Select>
      <span>span</span>
      <Comp>
        <span>child</span>
      </Comp>
    </Select>
  );
};

export const One = () => {
  return (
    <Select>
      <span>aaa</span>
    </Select>
  );
};

export const Two = () => {
  return (
    <Select>
      <div style={{ background: "red" }}>aaa</div>
      <div>aaa</div>
    </Select>
  );
};

export const Line = () => {
  type Data = { name: number; value: number };

  const [datas, setDatas] = useState<Data[]>(getRangedData(1000));
  useEffect(() => {
    setInterval(() => {
      setDatas(getRangedData(100));
    }, 1000);
  }, []);

  const width = 400;
  const height = 300;

  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  xScale.domain(d3.extent(datas, (d) => d.name));
  yScale.domain([0, d3.max(datas, (d) => d.value)]);
  const line = d3
    .line<Data>()
    .x((d) => xScale(d.name))
    .y((d) => yScale(d.value));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Select>
        <path
          fill="none"
          stroke="steelblue"
          strokeWidth="1.5"
          d={line(datas)}
        />
      </Select>
    </svg>
  );
};
