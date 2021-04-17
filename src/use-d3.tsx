import { useRef } from "react";
import { D3Element } from "./dom";

export const d3Element = (name: string) => {
  return new D3Element(name);
};

export const useD3 = <T, U>(recipe: () => T, deps: U[]): T => {
  const resRef = useRef<T | null>(null);
  const depsRef = useRef<U[]>(deps);
  if (
    depsRef.current.length === deps.length &&
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
