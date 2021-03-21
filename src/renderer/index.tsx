import React, { useLayoutEffect, useRef } from "react";
import renderer from "./renderer";

export const Renderer = (props: { children: React.ReactNode }) => {
  useLayoutEffect(() => {
    renderer.render(props.children, ref.current!);
  }, [props.children]);
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} />;
};
