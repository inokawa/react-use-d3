import React, { useEffect, useRef } from "react";
import * as d3 from "d3-selection";

type Props = {
  type: string | React.JSXElementConstructor<any>;
  children: React.ReactNode;
  [key: string]: any;
};

export const Elem = React.memo(({ type, children, ...props }: Props) => {
  const vDomRef = useRef(d3.select(document.createElement("div")));
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof type !== "string") {
      return;
    }
    const el = d3.select(ref.current).data([props]).select(`rd-${type}`);

    // TODO enter
    const enter = el.enter().append(`rd-${type}`);

    // TODO update
    const update = enter.merge(el);
    Object.entries(props).forEach(([key, val]) => {
      key = key.toLowerCase();
      if (key === "className") {
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

  return React.createElement(type, { ...props, ref }, createElem(children));
});

export const createElem = (children: React.ReactNode) => {
  if (!children || typeof children === "boolean") {
    return null;
  } else if (typeof children === "string" || typeof children === "number") {
    return children;
  } else if (isChildren(children)) {
    return children.map((c) => <Elem type={c.type} {...c.props} />);
  } else if (isChild(children)) {
    return <Elem type={children.type} {...children.props} />;
  } else {
    return null;
  }
};

const isChildren = (children: any): children is React.ReactElement[] =>
  React.Children.count(children) > 1;

const isChild = (children: any): children is React.ReactElement =>
  React.Children.only(children);
