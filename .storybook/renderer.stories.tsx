import React, { useEffect, useState } from "react";
import { D3Context } from "../src/renderer";
import { getRangedData } from "./util";
import * as d3 from "d3";

export default {
  title: "renderer",
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
    <D3Context>
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
    </D3Context>
  );
};
