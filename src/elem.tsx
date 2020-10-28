import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "./d3";
import { kebabCase } from "./utils";

type Transition = {
  enter?: (
    sel: d3.Transition<HTMLElement, any, null, undefined>
  ) => d3.Transition<HTMLElement, any, null, undefined>;
  update?: (
    sel: d3.Transition<HTMLElement, any, null, undefined>
  ) => d3.Transition<HTMLElement, any, null, undefined>;
  exit?: (
    sel: d3.Transition<HTMLElement, any, null, undefined>
  ) => d3.Transition<HTMLElement, any, null, undefined>;
};

interface Props {
  children: React.ReactNode;
  transition?: Transition;
}

export const Selection = React.memo(({ children, transition }: Props) => {
  const vRef = useRef(d3.select(document.createElement("div")));

  if (!children || typeof children === "boolean") {
    return null;
  } else if (typeof children === "string" || typeof children === "number") {
    return children;
  } else if (isChildren(children)) {
    const arr = React.Children.toArray(children);
    const sel = vRef.current.selectAll("span").data(arr, (c, i) => c.key);
    const enter = sel.enter();
    const exit = sel.exit();

    const comps: JSX.Element[] = [];
    sel.each((c, i) => {
      comps.push(
        <Elem
          _d3State="update"
          transition={transition}
          key={c.key}
          type={c.type}
          {...c.props}
        />
      );
    });
    exit.each((c, i) => {
      comps.push(
        <Elem
          _d3State="exit"
          transition={transition}
          key={c.key}
          type={c.type}
          {...c.props}
        />
      );
    });
    enter.each((c, i) => {
      comps.push(
        <Elem
          _d3State="enter"
          transition={transition}
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
});

type ElemProps = {
  type: string | React.JSXElementConstructor<any>;
  children: React.ReactNode;
  className: string;
  transition?: Transition;
  _d3State: "enter" | "update" | "exit";
  [key: string]: any;
};

const Elem = React.memo(
  ({ type, children, transition, _d3State, ...props }: ElemProps) => {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(true);

    const { className, ...rest } = props;
    const [attrs, functions] = Object.entries(rest).reduce<
      [{ [key: string]: any }, { [key: string]: any }]
    >(
      (acc, [k, v]) => {
        if (typeof v === "function") {
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
      if (!visible) return;
      if (isComponent(type)) {
        // TODO change updater
        return;
      }
      const el = d3.select(ref.current).data([attrs]);
      const t = d3.transition();
      if (_d3State === "enter") {
        el.transition(t).style("background", "green");
        return;
      } else if (_d3State === "exit") {
        el.transition(t)
          .style("background", "red")
          .style("opacity", "0")
          .on("end", () => {
            setVisible(false);
          });
        return;
      } else {
        const update = el.transition(t).style("background", "transparent");
        Object.entries(attrs).forEach(([key, val]) => {
          if (key === "style") {
            for (const sKey of Object.keys(val)) {
              update.style(kebabCase(sKey), val[sKey]);
            }
          } else {
            update.attr(kebabCase(key), val);
          }
        });
      }
    }, [attrs]);

    if (!visible) return null;
    return isComponent(type)
      ? React.createElement(type, props, children)
      : React.createElement(type, { ...functions, className, ref }, children);
  }
);

const isComponent = (
  type: ElemProps["type"]
): type is Exclude<ElemProps["type"], string> => typeof type !== "string";

const isChildren = (children: any): children is React.ReactElement[] =>
  React.Children.count(children) > 0;
