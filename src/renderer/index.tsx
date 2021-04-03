import React, { useLayoutEffect, useRef } from "react";
import { render } from "./renderer";
export * from "./renderer";

export const D3Context = (props: { children: React.ReactNode }) => {
  useLayoutEffect(() => {
    render(props.children, ref.current);
  }, [props.children]);
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} />;
};
