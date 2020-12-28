import React, {
  useRef,
  useLayoutEffect,
  useMemo,
  useState,
  createRef,
  cloneElement,
} from "react";
import * as d3 from "d3";

type Option<T> = {
  key?: (d: T, i: number) => string | number;
  enter?: (s: d3.Selection<any, T, any, T>) => void;
  update?: (s: d3.Selection<any, T, any, T>) => void;
  exit?: (s: d3.Selection<any, T, any, T>) => void;
  // applyAttr?:
};

type RefMap = { [key: string]: React.RefObject<HTMLElement> };

export const useD3 = <T extends unknown>(
  data: T[],
  render: (d: T, i: number) => React.ReactNode,
  {
    key: _key = (d, i) => i,
    enter: _enter,
    update: _update,
    exit: _exit,
  }: Option<T>
): [
  React.ReactNode,
  (fn: (s: d3.Selection<any, T, any, T>) => void) => void
] => {
  const vRef = useRef(d3.select(document.createElement("custom")));
  const refMap = useRef<RefMap>({});
  const prevRefMap = refMap.current;

  const arr = useMemo(() => toArray(data), [data]);
  const sel = vRef.current
    .selectAll((d, i) =>
      Object.entries(prevRefMap).reduce<HTMLElement[]>((acc, [k, r]) => {
        if (r.current) {
          acc.push(r.current);
        }
        return acc;
      }, [])
    )
    .data(arr, _key);

  refMap.current = arr.reduce<RefMap>((acc, d, i) => {
    const key = _key(d, i);
    acc[key] = refMap.current[key] || createRef();
    return acc;
  }, {});

  const nodes: React.ReactNode[] = [];
  const exitDatas: { i: number; d: T }[] = [];
  sel.exit().each((d, i) => exitDatas.push({ i, d }));
  sel.merge(sel.enter()).each((d, i) => {
    while (exitDatas[0]) {
      if (exitDatas[0] && exitDatas[0].i <= i) {
        const ex = exitDatas.shift();
        const exitedKey = _key(ex.d, i);
        nodes.push(
          cloneElement(render(ex.d, i), {
            key: exitedKey,
            ref: prevRefMap[exitedKey],
          })
        );
      } else {
        break;
      }
    }
    const key = _key(d, i);
    nodes.push(cloneElement(render(d, i), { key, ref: refMap.current[key] }));
  });
  exitDatas.forEach((ex) => {
    const exitedKey = _key(ex.d, ex.i);
    nodes.push(
      cloneElement(render(ex.d, ex.i), {
        key: exitedKey,
        ref: prevRefMap[exitedKey],
      })
    );
  });

  useLayoutEffect(() => {
    const enter = sel.enter().select((d, i) => {
      const ref = refMap.current[_key(d, i)];
      if (!ref || !ref.current) return undefined;
      ref.current.__data__ = d;
      return ref.current;
    });
    _enter?.(enter);

    _update?.(sel);

    const exit = sel.exit();
    exit
      .transition(_exit?.(exit))
      .on("end", (d, i) => {
      });
  });

  return [
    <>{nodes}</>,
    (fn) => {
      setTimeout(() => {
        fn(
          sel.merge(sel.enter()).select((d, i) => {
            const ref = refMap.current[_key(d, i)];
            if (!ref || !ref.current) return undefined;
            return ref.current;
          })
        );
      });
    },
  ];
};
};

const toArray = (data: any): any[] => {
  let arr: any[];
  if (!data) {
    arr = [];
  } else if (!Array.isArray(data)) {
    arr = [data];
  } else {
    arr = data;
  }
  return arr;
};
