import React from "react";

export const camelToKebab = (str: string): string =>
  str.replace(/([A-Z])/g, (m) => "-" + m.toLowerCase());

export const isComponent = (
  type: string | React.JSXElementConstructor<any>
): type is React.JSXElementConstructor<any> => typeof type !== "string";

export const isChildren = (children: any): children is React.ReactElement[] =>
  React.Children.count(children) > 0;
