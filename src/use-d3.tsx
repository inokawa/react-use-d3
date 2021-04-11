import { useRef } from "react";
import { Element as FauxElement } from "./faux-dom/ReactFauxDOM";
// import * as d3 from "d3";

export const createElement = (name: string) => {
  return new FauxElement(name);
  //   return d3.select((el as any) as HTMLElement);
};

export const useD3 = <T, U>(recipe: () => T, deps: U[]): T => {
  const resRef = useRef<T | null>(null);
  const depsRef = useRef<U[]>(deps);
  if (
    (depsRef.current.length === 0 && depsRef.current.length === deps.length) ||
    depsRef.current.length !== deps.length ||
    depsRef.current.every((d, i) => d === deps[i])
  ) {
    if (resRef.current === null) {
      resRef.current = recipe();
    }
    return resRef.current;
  }
  depsRef.current = deps;
  resRef.current = recipe();

  return resRef.current;
};
