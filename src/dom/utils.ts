import { EVENT_NAME_MAPPING } from "./constants";

const HYPHEN_EXP = /-+([a-z])/gi;

export function camelCase(str: string): string {
  const camelCased = str.replace(HYPHEN_EXP, (match, c, offset) => {
    if (offset !== 0) {
      return c.toUpperCase();
    } else {
      return c;
    }
  });
  HYPHEN_EXP.lastIndex = 0;
  return camelCased;
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isUndefined(value: any): value is undefined {
  return typeof value === "undefined";
}

export const eventToPropName = (name: string): string => {
  return (
    (EVENT_NAME_MAPPING as any)[name] ||
    "on" + name.slice(0, 1).toUpperCase() + name.slice(1)
  );
};

const SKIP_ATTR_EXP = [/^data-/, /^aria-/] as const;

export const attrToPropName = (name: string): string => {
  if (SKIP_ATTR_EXP.some((expr) => expr.test(name))) {
    return name;
  } else if (name === "class") {
    return "className";
  } else {
    return camelCase(name);
  }
};

export function styleToPropName(name: string): string {
  const camel = camelCase(name);

  // Detect if the style property is already camelCased
  // To not convert Webkit*, Moz* and O* to lowercase
  if (camel.charAt(0).toUpperCase() === name.charAt(0)) {
    return name.charAt(0) + camel.slice(1);
  } else if (name.charAt(0) === "-") {
    return camel.indexOf("ms") === 0
      ? camel
      : camel.charAt(0).toUpperCase() + camel.slice(1);
  } else {
    return camel;
  }
}
