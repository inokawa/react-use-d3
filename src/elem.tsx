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

export const Elem = React.memo(
  ({ type, children, className, ...props }: Props) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
      if (!ref.current) return;
      if (typeof type !== "string") {
        return;
      }
      const el = d3.select(ref.current).data([props]);
      // TODO enter
      const enter = el.enter();

      // TODO update
      const t = d3Transition.transition();
      const update = enter.merge(el).transition(t);
      Object.entries(props).forEach(([key, val]) => {
        if (key === "style") {
          for (const sKey of Object.keys(val)) {
            update.style(kebabCase(sKey), val[sKey]);
          }
        } else if (typeof val === "function") {
          if (key.startsWith("on")) {
          } else {
          }
        } else {
          update.attr(key, val);
        }
      });
      // TODO exit
      const exit = el.exit();
      exit.remove();
    }, [props]);

    return React.createElement(
      type,
      {
        className,
        ref,
      },
      createElem(children)
    );
  }
);

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

const isChildren = (children: any): children is React.ReactElement[] =>
  React.Children.count(children) > 0;
