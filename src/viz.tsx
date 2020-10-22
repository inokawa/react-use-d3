import React, { useMemo, useEffect, useRef } from "react";
import { Elem, createElem } from "./elem";

interface Props {
  children: React.ReactNode;
}

export const Viz = ({ children }: Props) => {
  return createElem(children);
};
