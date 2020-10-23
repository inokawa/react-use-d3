import React from "react";
import { createElem } from "./elem";

interface Props {
  children: React.ReactNode;
}

export const Viz = ({ children }: Props) => {
  return createElem(children) as JSX.Element;
};
