import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as d3 from "./d3";
import { kebabCase } from "./utils";

interface VizProps {
  children: React.ReactNode;
}

export const Viz = ({ children }: VizProps) => {
  const rootRef = useRef(d3.select(document.createElement("div")));

  const res = useElem(children, rootRef);
  if (res) {
    return res;
  } else {
    return null;
  }
};

type Props = {
  type: string | React.JSXElementConstructor<any>;
  key: React.Key | null;
  children: React.ReactNode;
  className: string;
  [key: string]: any;
};

export const Elem = React.memo(({ type, children, ...props }: Props) => {
  const ref = useRef<HTMLElement>(null);

  const { key, className, ...rest } = props;
  const [attrs, eventListeners] = Object.entries(rest).reduce<
    [{ [key: string]: any }, { [key: string]: any }]
  >(
    (acc, [k, v]) => {
      if (k.startsWith("on")) {
        acc[1][k] = v;
      } else {
        acc[0][k] = v;
      }
      return acc;
    },
    [{}, {}]
  );

  useEffect(() => {
    if (!ref.current) return;
    if (isComponent(type)) {
      return;
    }
    const el = d3.select(ref.current).data([attrs]);
    const t = d3.transition();
    const {
      "data-rvz-enter": isEnter,
      "data-rvz-update": isUpdate,
      "data-rvz-exit": isExit,
      ...rest
    } = attrs;
    if (isEnter) {
      el.transition(t).style("background", "green").style("opacity", "1");
      return;
    }
    if (isExit) {
      el.transition(t).style("background", "red").style("opacity", "0");
      return;
    }
    if (isUpdate) {
      const update = el.transition(t);
      Object.entries(rest).forEach(([key, val]) => {
        if (key === "style") {
          for (const sKey of Object.keys(val)) {
            update.style(kebabCase(sKey), val[sKey]);
          }
        } else if (typeof val === "function") {
          // TODO
        } else {
          update.attr(key, val);
        }
      });
    }
  }, [attrs]);

  if (isComponent(type)) {
    return React.createElement(type, props, useElem(children, null));
  }
  return React.createElement(
    type,
    { ...eventListeners, className, ref },
    useElem(children, null)
  );
});

export const useElem = (
  children: React.ReactNode,
  ref: React.MutableRefObject<
    d3.Selection<HTMLDivElement, unknown, null, undefined>
  > | null
) => {
  if (!children || typeof children === "boolean") {
    return null;
  } else if (typeof children === "string" || typeof children === "number") {
    return children;
  } else if (isChildren(children)) {
    if (!ref) return null;
    const arr = React.Children.toArray(children);
    const sel = ref.current.selectAll("span").data(arr, (c) => c.key);
    const enter = sel.enter();
    const exit = sel.exit();

    const comps: JSX.Element[] = [];
    sel.each((c, i) => {
      comps.push(
        <Elem
          data-rvz-enter={undefined}
          data-rvz-update
          data-rvz-exit={undefined}
          key={c.key}
          type={c.type}
          {...c.props}
        />
      );
    });
    exit.each((c, i) => {
      comps.push(
        <Elem
          data-rvz-enter={undefined}
          data-rvz-update={undefined}
          data-rvz-exit
          key={c.key}
          type={c.type}
          {...c.props}
        />
      );
    });
    enter.each((c, i) => {
      comps.push(
        <Elem
          data-rvz-enter
          data-rvz-update={undefined}
          data-rvz-exit={undefined}
          key={c.key}
          type={c.type}
          {...c.props}
        />
      );
    });

    enter.append((d, i) => document.createElement("span"));
    exit.remove();
    return comps;
  } else {
    return null;
  }
};

const isComponent = (
  type: Props["type"]
): type is Exclude<Props["type"], string> => typeof type !== "string";

const isChildren = (children: any): children is React.ReactElement[] =>
  React.Children.count(children) > 0;
