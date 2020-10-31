import React, { useEffect, useRef, useState } from "react";
import * as d3 from "./d3";
import { camelToKebab, isChildren, isComponent } from "./utils";

type d3Transition = d3.Transition<HTMLElement, unknown, null, undefined>;

type TransitionSetting = {
  duration?: d3Transition["duration"];
  ease?: d3Transition["ease"];
};

type TransitionOption = {
  style?: { [key in keyof React.CSSProperties]: TransitionSetting };
  attr?: { [key: string]: TransitionSetting };
};

type TransitionCallback = (transition: d3Transition) => void;

type Props = {
  children: React.ReactNode;
} & TransitionProps;

type TransitionProps = {
  enter?: TransitionOption | TransitionCallback;
  update?: TransitionOption | TransitionCallback;
  exit?: TransitionOption | TransitionCallback;
};

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
  _transition?: TransitionProps;
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
      const tr = sel.transition(d3.transition() as any);
      if (_d3State === "enter") {
        const enter = _transition?.enter;
        if (enter) {
          if (typeof enter === "function") {
            enter(tr);
          } else {
            tr.call(setAttr, attrs);
          }
        }
      } else if (_d3State === "exit") {
        const exit = _transition?.exit;
        if (exit) {
          if (typeof exit === "function") {
            exit(tr);
          } else {
            tr.call(setAttr, attrs);
          }
        }
        tr.on("end", () => {
          setVisible(false);
        });
      } else {
        const update = _transition?.update;
        if (update) {
          if (typeof update === "function") {
            update(tr);
          } else {
            tr.call(setAttr, attrs);
          }
        }
      }
    }, [attrs]);

    if (!visible) return null;
    return isComponent(type)
      ? React.createElement(type, props, children)
      : React.createElement(type, { ...functions, className, ref }, children);
  }
);

const setAttr = (sel: d3Transition, attrs: { [key: string]: any }) => {
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === "style") {
      for (const sKey of Object.keys(val)) {
        sel.style(camelToKebab(sKey), val[sKey]);
      }
    } else {
      sel.attr(camelToKebab(key), val);
    }
  });
};
