export const ELEMENT_NODE = 1 as const;
export const DOCUMENT_POSITION_DISCONNECTED = 1 as const;
export const DOCUMENT_POSITION_PRECEDING = 2 as const;
export const DOCUMENT_POSITION_FOLLOWING = 4 as const;
export const DOCUMENT_POSITION_CONTAINS = 8 as const;
export const DOCUMENT_POSITION_CONTAINED_BY = 16 as const;

// This was easy to do with Vim.
// Just saying.
export const EVENT_NAME_MAPPING = {
  blur: "onBlur",
  change: "onChange",
  click: "onClick",
  contextmenu: "onContextMenu",
  copy: "onCopy",
  cut: "onCut",
  doubleclick: "onDoubleClick",
  drag: "onDrag",
  dragend: "onDragEnd",
  dragenter: "onDragEnter",
  dragexit: "onDragExit",
  dragleave: "onDragLeave",
  dragover: "onDragOver",
  dragstart: "onDragStart",
  drop: "onDrop",
  error: "onError",
  focus: "onFocus",
  input: "onInput",
  keydown: "onKeyDown",
  keypress: "onKeyPress",
  keyup: "onKeyUp",
  load: "onLoad",
  mousedown: "onMouseDown",
  mouseenter: "onMouseEnter",
  mouseleave: "onMouseLeave",
  mousemove: "onMouseMove",
  mouseout: "onMouseOut",
  mouseover: "onMouseOver",
  mouseup: "onMouseUp",
  paste: "onPaste",
  scroll: "onScroll",
  submit: "onSubmit",
  touchcancel: "onTouchCancel",
  touchend: "onTouchEnd",
  touchmove: "onTouchMove",
  touchstart: "onTouchStart",
  wheel: "onWheel",
} as const;

export const SKIP_NAME_TRANSFORMATION_EXPRESSIONS = [
  /^data-/,
  /^aria-/,
] as const;

export const ATTRIBUTE_NAME_MAPPING = {
  class: "className",
} as const;
