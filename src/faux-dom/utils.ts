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

export function isString(value: any): boolean {
  return typeof value === "string";
}

export function isUndefined(value: any): boolean {
  return typeof value === "undefined";
}

export function mapValues(source, fn) {
  const destination = {};

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      destination[key] = fn(source[key]);
    }
  }

  return destination;
}

export const eventToPropName = (name: string): string => {
  return EVENT_NAME_MAPPING[name] || name;
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
