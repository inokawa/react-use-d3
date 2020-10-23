import React, { useEffect, useRef } from "react";
import * as d3 from "d3-selection";
import * as d3Transition from "d3-transition";
import { kebabCase } from "./utils";

type Props = {
  type: string | React.JSXElementConstructor<any>;
  children: React.ReactNode;
  className: string;
  [key: string]: any;
};

export const Elem = React.memo(({ type, children, ...props }: Props) => {
  const ref = useRef<HTMLElement>(null);

  const { className, ...rest } = props;
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
    // TODO enter
    const enter = el.enter();

    // TODO update
    const t = d3Transition.transition();
    const update = enter.merge(el).transition(t);
    Object.entries(attrs).forEach(([key, val]) => {
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

    // TODO exit
    const exit = el.exit();
    exit.remove();
  }, [attrs]);

  if (isComponent(type)) {
    return React.createElement(type, props, createElem(children));
  }
  return React.createElement(
    type,
    { ...eventListeners, className, ref },
    createElem(children)
  );
});

export const createElem = (children: React.ReactNode) => {
  if (!children || typeof children === "boolean") {
    return null;
  } else if (typeof children === "string" || typeof children === "number") {
    return children;
  } else if (isChildren(children)) {
    return React.Children.map(children, (c) => (
      <Elem type={c.type} {...c.props} />
    ));
  } else {
    return null;
  }
};

const isComponent = (
  type: Props["type"]
): type is Exclude<Props["type"], string> => typeof type !== "string";

const isChildren = (children: any): children is React.ReactElement[] =>
  React.Children.count(children) > 0;
