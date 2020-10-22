import React, { useMemo, useEffect, useRef } from "react";
import { Elem } from "./elem";

interface Props {
  children: React.ReactNode;
}

export const Viz = ({ children }: Props) => {
  if (!children) {
    return null;
  } else if (typeof children === "string" || typeof children === "number") {
    return null;
  } else if (React.Children.count(children) > 1) {
    return children.map((c) => <Elem type={c.type} {...c.props} />);
  } else if (React.Children.only(children)) {
    return <Elem type={children.type} {...children.props} />;
  } else {
    return null;
  }
};
