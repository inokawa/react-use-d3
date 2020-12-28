import React, {
  useRef,
  useLayoutEffect,
  useMemo,
  useState,
  createRef,
  cloneElement,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";
import * as d3 from "d3";

type Option<T> = {
  key?: (d: T, i: number) => string | number;
  enter?: (s: d3.Selection<any, T, any, T>) => void;
  update?: (s: d3.Selection<any, T, any, T>) => void;
  exit?: (s: d3.Selection<any, T, any, T>) => void;
  // applyAttr?:
};

type RefMap = { [key: string]: React.RefObject<D3NodeHandle> };

export const useD3 = <T extends unknown>(
  data: T[],
  render: (d: T, i: number) => React.ReactElement,
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
  const vRef = useRef(
    d3.select<HTMLElement, T>(document.createElement("custom"))
  );
  const refMap = useRef<RefMap>({});
  const prevRefMap = refMap.current;

  const arr = useMemo(() => toArray(data), [data]);
  const sel = vRef.current
    .selectAll((d, i) =>
      Object.entries(prevRefMap).reduce<HTMLElement[]>((acc, [k, r]) => {
        if (r.current && r.current.node.current) {
          acc.push(r.current.node.current);
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
        const ex = exitDatas.shift()!;
        const exitedKey = _key(ex.d, ex.i);
        nodes.push(
          <D3Node
            key={exitedKey}
            ref={prevRefMap[exitedKey]}
            d={ex.d}
            i={ex.i}
            render={render}
          />
        );
      } else {
        break;
      }
    }
    const key = _key(d, i);
    nodes.push(
    );
  });
  exitDatas.forEach((ex) => {
    const exitedKey = _key(ex.d, ex.i);
    nodes.push(
      <D3Node
        key={exitedKey}
        ref={prevRefMap[exitedKey]}
        d={ex.d}
        i={ex.i}
        render={render}
      />
    );
  });

  useLayoutEffect(() => {
    const enter = sel.enter().select((d, i) => {
      const ref = refMap.current[_key(d, i)];
      if (!ref || !ref.current || !ref.current.node.current) return undefined;
      ref.current.node.current.__data__ = d;
      return ref.current.node.current;
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
            if (!ref || !ref.current || !ref.current.node.current)
              return undefined;
            return ref.current.node.current;
          })
        );
      });
    },
  ];
};

type D3NodeProps<T> = {
  d: T;
  i: number;
  render: (d: T, i: number) => React.ReactElement;
};
type D3NodeHandle = {
  node: React.RefObject<HTMLElement>;
  hide: () => void;
};
const D3Node = memo(
  forwardRef<D3NodeHandle, D3NodeProps<any>>(({ d, i, render }, ref) => {
    const [show, setShow] = useState(true);
    const nodeRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => ({
      node: nodeRef,
      hide: () => {
        setShow(false);
      },
    }));
    return show
      ? cloneElement(render(d, i), {
          ref: nodeRef,
        })
      : null;
  })
);

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
