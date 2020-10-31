import React, { useEffect, useRef, useState } from "react";
import * as d3 from "./d3";
import { kebabCase, isChildren, isComponent } from "./utils";

interface Props {
  children: React.ReactNode;
  onEnter?: (
    transition: d3.Transition<HTMLElement, unknown, null, undefined>
  ) => void;
  onUpdate?: (
    transition: d3.Transition<HTMLElement, unknown, null, undefined>
  ) => void;
  onExit?: (
    transition: d3.Transition<HTMLElement, unknown, null, undefined>
  ) => void;
}

export const Select = React.memo(
  ({ children, ...props }: Props): JSX.Element => {
    const vRef = useRef(d3.select(document.createElement("div")));
    const arr = React.Children.toArray(children) as React.ReactElement[];
    const sel = vRef.current
      .selectAll("span")
      .data(arr, (c, i) => (c as any).key);
    const enter = sel.enter();
    const exit = sel.exit<React.ReactElement>();

    let res: JSX.Element;
    if (!children || typeof children === "boolean") {
      res = <>{null}</>;
    } else if (typeof children === "string" || typeof children === "number") {
      // TODO text interpolation
      res = <>{children}</>;
    } else if (isChildren(children)) {
      const comps: React.ReactElement[] = [];
      sel.each((c, i) => {
        comps.push(
          <Elem
            _d3State="update"
            _transition={props}
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
            _transition={props}
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
            _transition={props}
            key={c.key}
            type={c.type}
            {...c.props}
          />
        );
      });
      res = <>{comps}</>;
    } else {
      res = <>{null}</>;
    }

    enter.append((d, i) => document.createElement("span"));
    exit.remove();
    return res;
  }
);

type ElemProps = {
  type: string | React.JSXElementConstructor<any>;
  children: React.ReactNode;
  className: string;
  _d3State: "enter" | "update" | "exit";
  _transition?: {
    onEnter?: (
      transition: d3.Transition<HTMLElement, unknown, null, undefined>
    ) => void;
    onUpdate?: (
      transition: d3.Transition<HTMLElement, unknown, null, undefined>
    ) => void;
    onExit?: (
      transition: d3.Transition<HTMLElement, unknown, null, undefined>
    ) => void;
  };
  [key: string]: any;
};

const Elem = React.memo(
  ({ type, children, _d3State, _transition, ...props }: ElemProps) => {
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
      const sel = d3.select(ref.current);
      const setAttr = (
        s: d3.Transition<HTMLElement, unknown, null, undefined>,
        at: { [key: string]: any }
      ) => {
        Object.entries(at).forEach(([key, val]) => {
          if (key === "style") {
            for (const sKey of Object.keys(val)) {
              s.style(kebabCase(sKey), val[sKey]);
            }
          } else {
            s.attr(kebabCase(key), val);
          }
        });
      };
      const tr = sel.transition(d3.transition() as any);
      if (_d3State === "enter") {
        _transition?.onEnter?.(tr);
        tr.call(setAttr, { style: { background: "green" } });
      } else if (_d3State === "exit") {
        _transition?.onExit?.(tr);
        tr.call(setAttr, { style: { background: "red", opacity: "0" } }).on(
          "end",
          () => {
            setVisible(false);
          }
        );
      } else {
        _transition?.onUpdate?.(tr);
        tr.call(setAttr, attrs);
      }
    }, [attrs]);

    if (!visible) return null;
    return isComponent(type)
      ? React.createElement(type, props, children)
      : React.createElement(type, { ...functions, className, ref }, children);
  }
);
