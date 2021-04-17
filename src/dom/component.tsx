import React, { forwardRef, useState, useImperativeHandle } from "react";

type D3NodeProps = {
  children: React.ReactElement;
};

export type D3NodeHandle = {
  hide: () => void;
};

export const D3Node = forwardRef<D3NodeHandle, D3NodeProps>(
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
