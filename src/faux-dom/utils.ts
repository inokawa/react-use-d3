import {
  EVENT_NAME_MAPPING,
  ATTRIBUTE_NAME_MAPPING,
  SKIP_NAME_TRANSFORMATION_EXPRESSIONS,
} from "./constants";

// export function assign(dest: any) {
//   var args = arguments;
//   var source;

//   for (var i = 1; i < args.length; i++) {
//     source = args[i];

//     for (var key in source) {
//       dest[key] = source[key];
//     }
//   }

//   return dest;
// }

const hyphenExpression = /-+([a-z])/gi;

function upperCaseFirstMatch(match, c, offset) {
  if (offset !== 0) {
    return c.toUpperCase();
  } else {
    return c;
  }
}

export function camelCase(str) {
  const camelCased = str.replace(hyphenExpression, upperCaseFirstMatch);
  hyphenExpression.lastIndex = 0;
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

export const attrToPropName = (name: string): string => {
  const skipTransformMatches = SKIP_NAME_TRANSFORMATION_EXPRESSIONS.map(
    (expr) => expr.test(name)
  );

  if (skipTransformMatches.some(Boolean)) {
    return name;
  } else {
    return ATTRIBUTE_NAME_MAPPING[name] || camelCase(name);
  }
};

export function styleToPropName(name: string): string {
  const camel = camelCase(name);

  // Detect if the style property is already camelCased
  // To not convert Webkit*, Moz* and O* to lowercase
  if (camel.charAt(0).toUpperCase() === name.charAt(0)) {
    return name.charAt(0) + camel.slice(1);
  }

  if (name.charAt(0) === "-") {
    return camel.indexOf("ms") === 0
      ? camel
      : camel.charAt(0).toUpperCase() + camel.slice(1);
  } else {
    return camel;
  }
}
