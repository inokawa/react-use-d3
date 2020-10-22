import React, { useEffect, useState } from "react";
import { Viz } from "../src";
import { getRangedData } from "./util";

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
  return (
    <Viz>
      {datas.map((d) => (
        <div key={d.name} style={{ width: d.value, background: "steelblue" }}>
          {d.value}
        </div>
      ))}
    </Viz>
  );
};
export const Text = () => {
  return <Viz>aaa</Viz>;
};

export const One = () => {
  return (
    <Viz>
      <span>aaa</span>
    </Viz>
  );
};

export const Two = () => {
  return (
    <Viz>
      <div style={{ background: "red" }}>aaa</div>
      <div>aaa</div>
    </Viz>
  );
};

export const Line = () => {
  return (
    <Viz>
      <svg width="400" height="300" viewBox="0 0 400 300">
        <path
          fill="none"
          stroke="steelblue"
          strokeWidth="1.5"
          d="M63.229166666666664,195.78947368421055L76.14583333333334,91.89473684210526L114.89583333333334,193.57894736842104L124.58333333333334,167.0526315789474L202.08333333333331,45.473684210526315L221.45833333333334,129.47368421052633L273.125,30L324.79166666666663,213.47368421052633L366.77083333333337,142.73684210526315L370,41.05263157894738"
        ></path>
      </svg>
    </Viz>
  );
};
