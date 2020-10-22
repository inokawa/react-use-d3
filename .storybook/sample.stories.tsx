import React from "react";
import { Viz } from "../src";

export default {
  title: "sample",
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
