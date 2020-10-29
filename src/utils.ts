import React from "react";

const REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export function kebabCase(str: string): string {
  return str.replace(REGEX, (match) => "-" + match.toLowerCase());
}

export const isComponent = (
  type: string | React.JSXElementConstructor<any>
): type is React.JSXElementConstructor<any> => typeof type !== "string";

export const isChildren = (children: any): children is React.ReactElement[] =>
  React.Children.count(children) > 0;
