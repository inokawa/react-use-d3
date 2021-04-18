import { useRef } from "react";
import { D3Element } from "./dom";

const d3Element = (name: string): HTMLElement & Pick<D3Element, "toReact"> => {
  return new D3Element(name) as any;
};

export const useD3 = <T, U>(
  recipe: (create: typeof d3Element) => T,
  deps: U[]
): T => {
  const resRef = useRef<T | null>(null);
  const depsRef = useRef<U[]>(deps);
  if (
    depsRef.current.length === deps.length &&
    depsRef.current.every((d, i) => d === deps[i])
  ) {
    if (resRef.current === null) {
      resRef.current = recipe(d3Element);
    }
    return resRef.current;
  }
  depsRef.current = deps;
  resRef.current = recipe(d3Element);

  return resRef.current;
};
