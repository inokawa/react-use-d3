import React, { forwardRef, useState, useImperativeHandle } from "react";

type FauxNodeProps = {
  children: React.ReactElement;
};

export type FauxNodeHandle = {
  hide: () => void;
};

export const FauxNode = forwardRef<FauxNodeHandle, FauxNodeProps>(
  ({ children }, ref) => {
    const [show, setShow] = useState(true);
    useImperativeHandle(
      ref,
      () => ({
        hide: () => setShow(false),
      }),
      [setShow]
    );
    return show ? children : null;
  }
);
