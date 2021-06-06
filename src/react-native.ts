import { View } from "react-native";
import {
  Svg,
  Rect,
  Circle,
  Ellipse,
  Line,
  Polygon,
  Polyline,
  Path,
  Text,
  TSpan,
  TextPath,
  G,
  Use,
  Symbol,
  Defs,
  Image,
  ClipPath,
  LinearGradient,
  RadialGradient,
  Mask,
  Pattern,
  Marker,
  ForeignObject,
} from "react-native-svg";
import { buildHook } from "./hooks";

const resolver = (name: keyof JSX.IntrinsicElements) => {
  switch (name) {
    case "svg":
      return Svg;
    case "rect":
      return Rect;
    case "circle":
      return Circle;
    case "ellipse":
      return Ellipse;
    case "line":
      return Line;
    case "polygon":
      return Polygon;
    case "polyline":
      return Polyline;
    case "path":
      return Path;
    case "text":
      return Text;
    case "tspan":
      return TSpan;
    case "textPath":
      return TextPath;
    case "g":
      return G;
    case "use":
      return Use;
    case "symbol":
      return Symbol;
    case "defs":
      return Defs;
    case "image":
      return Image;
    case "clipPath":
      return ClipPath;
    case "linearGradient":
      return LinearGradient;
    case "radialGradient":
      return RadialGradient;
    case "mask":
      return Mask;
    case "pattern":
      return Pattern;
    case "marker":
      return Marker;
    case "foreignObject":
      return ForeignObject;
    default:
      return View;
  }
};

export const useD3RN = buildHook(resolver);
