import React, { useEffect, useState } from "react";
import { Rvz } from "../src";
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
    <Rvz>
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
    </Rvz>
  );
};

export const Text = () => {
  return <Rvz>aaa</Rvz>;
};

const Comp = (props: any) => {
  return <span>{props.children}</span>;
};
export const Component = () => {
  return (
    <Rvz>
      <span>span</span>
      <Comp>
        <span>child</span>
      </Comp>
    </Rvz>
  );
};

export const One = () => {
  return (
    <Rvz>
      <span>aaa</span>
    </Rvz>
  );
};

export const Two = () => {
  return (
    <Rvz>
      <div style={{ background: "red" }}>aaa</div>
      <div>aaa</div>
    </Rvz>
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
      <Rvz>
        <path
          fill="none"
          stroke="steelblue"
          strokeWidth="1.5"
          d={line(datas)}
        />
      </Rvz>
    </svg>
  );
};
