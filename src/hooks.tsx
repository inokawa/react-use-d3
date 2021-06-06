import { useRef } from "react";
import { D3Element, NodeResolver } from "./dom";

const d3ElementCreate = (
  name: string
): HTMLElement & Pick<D3Element, "toReact"> => {
  return new D3Element({ nodeName: name }, true) as any;
};

export const buildHook = (nodeResolver: NodeResolver) => {
  return <T, U>(
    recipe: (create: typeof d3ElementCreate) => T,
    deps: U[]
  ): T => {
    const resRef = useRef<T | null>(null);
    const depsRef = useRef<U[]>(deps);
    if (
      depsRef.current.length === deps.length &&
      depsRef.current.every((d, i) => d === deps[i])
    ) {
      if (resRef.current === null) {
        resRef.current = recipe(d3ElementCreate);
      }
      return resRef.current;
    }
    resRef.current = recipe(d3ElementCreate);
    depsRef.current = deps;

    return resRef.current;
  };
};
