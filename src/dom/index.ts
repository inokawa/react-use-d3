import React, { createElement, createRef } from "react";
// @ts-expect-error
import * as styleAttr from "style-attr";
// @ts-expect-error
import querySelectorAll from "query-selector";
import {
  isString,
  isUndefined,
  styleToPropName,
  eventToPropName,
  attrToPropName,
} from "./utils";
import { ELEMENT_NODE, DOCUMENT_POSITION } from "./constants";
import { D3Node, D3NodeHandle } from "./component";

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const mapEventListener = (
  self: D3Element,
  listeners: EventListenerOrEventListenerObject[]
) => (syntheticEvent: React.SyntheticEvent) => {
  let event: Event;

  if (syntheticEvent) {
    event = syntheticEvent.nativeEvent;
    (event as any).syntheticEvent = syntheticEvent;
  }

  listeners.forEach((listener) => {
    (listener as any).call(self, event);
  });
};

function isAncestor(source: D3Element, target: D3Element): boolean {
  while (target.parentNode) {
    target = target.parentNode;
    if (target === source) {
      return true;
    }
  }
  return false;
}

function getFirstNodeByOrder(
  nodes: D3Element[],
  nodeOne: D3Element,
  nodeTwo: D3Element
): D3Element | false {
  return nodes.reduce((result: D3Element | false, node) => {
    if (result !== false) {
      return result;
    } else if (node === nodeOne) {
      return nodeOne;
    } else if (node === nodeTwo) {
      return nodeTwo;
    } else if (node.childNodes) {
      return getFirstNodeByOrder(node.childNodes, nodeOne, nodeTwo);
    } else {
      return false;
    }
  }, false);
}

function eitherContains(left: D3Element, right: D3Element): number | false {
  return isAncestor(left, right)
    ? DOCUMENT_POSITION.CONTAINED_BY + DOCUMENT_POSITION.FOLLOWING
    : isAncestor(right, left)
    ? DOCUMENT_POSITION.CONTAINS + DOCUMENT_POSITION.PRECEDING
    : false;
}

function getRootNode(node: D3Element): D3Element {
  while (node.parentNode) {
    node = node.parentNode;
  }
  return node;
}

class FauxStyle {
  style: { [key: string]: string | null };

  constructor(style: { [key: string]: string | null } = {}) {
    this.style = style;
  }

  setProperty: CSSStyleDeclaration["setProperty"] = (name, value) => {
    this.style[styleToPropName(name)] = value;
  };
  getPropertyValue: CSSStyleDeclaration["getPropertyValue"] = (name) => {
    return this.style[styleToPropName(name)] ?? "";
  };
  removeProperty: CSSStyleDeclaration["removeProperty"] = (name) => {
    const key = styleToPropName(name);
    const old = this.style[key];
    delete this.style[key];
    return old ?? "";
  };
}

export class D3Element {
  id: string;
  ref = createRef<HTMLElement>();
  mountRef = createRef<D3NodeHandle>();

  nodeType: number;
  nodeName: string;
  text: string;
  parentNode?: D3Element;
  childNodes: D3Element[];
  attrs: { [key: string]: string | null };
  style: FauxStyle;
  eventListeners: { [key: string]: EventListenerOrEventListenerObject[] };

  constructor(
    nodeName: string,
    parentNode?: D3Element,
    nodeType: number = ELEMENT_NODE,
    attrs: { [key: string]: string | null } = {},
    styles: { [key: string]: string | null } = {}
  ) {
    this.id = generateId();
    this.nodeName = nodeName;
    this.nodeType = nodeType;
    this.parentNode = parentNode;
    this.childNodes = [];
    this.text = "";
    this.attrs = attrs;
    this.style = new FauxStyle(styles);
    this.eventListeners = {};
  }

  getAttr() {
    return { ...this.attrs };
  }
  getStyle() {
    return { ...this.style.style };
  }
  unmount() {
    this.mountRef.current?.hide();
  }

  setAttribute: Element["setAttribute"] = (name, value) => {
    if (name === "style") {
      if (isString(value)) {
        const styles = styleAttr.parse(value);

        for (const key in styles) {
          const hasUpdate = this.style.getPropertyValue(key) !== styles[key];
          this.style.setProperty(key, styles[key]);
          if (this.ref.current && hasUpdate) {
            this.ref.current.style.setProperty(key, styles[key]);
          }
        }
      }
    } else {
      const hasUpdate = this.getAttribute(name) !== value;
      this.attrs[attrToPropName(name)] = value;
      if (this.ref.current && hasUpdate) {
        this.ref.current.setAttribute(name, value);
      }
    }
  };
  setAttributeNS: Element["setAttributeNS"] = (ns, ...args) =>
    this.setAttribute(...args);

  getAttribute: Element["getAttribute"] = (name) => {
    return this.attrs[attrToPropName(name)];
  };
  getAttributeNS: Element["getAttributeNS"] = (ns, ...args) =>
    this.getAttribute(...args);

  getAttributeNode: Element["getAttributeNode"] = (name) => {
    const value = this.getAttribute(name);
    if (!isUndefined(value)) {
      return {
        value: value,
        specified: true,
      } as Attr;
    }
    return null;
  };
  getAttributeNodeNS: Element["getAttributeNodeNS"] = (ns, ...args) =>
    this.getAttributeNode(...args);

  removeAttribute: Element["removeAttribute"] = (name) => {
    delete this.attrs[attrToPropName(name)];
  };
  removeAttributeNS: Element["removeAttributeNS"] = (ns, ...args) =>
    this.removeAttribute(...args);

  addEventListener = (name: string, fn: EventListenerOrEventListenerObject) => {
    const prop = eventToPropName(name);
    this.eventListeners[prop] = this.eventListeners[prop] || [];
    this.eventListeners[prop].push(fn);
  };

  removeEventListener = (
    name: string,
    fn: EventListenerOrEventListenerObject
  ) => {
    const listeners = this.eventListeners[eventToPropName(name)];

    if (listeners) {
      const match = listeners.indexOf(fn);

      if (match !== -1) {
        listeners.splice(match, 1);
      }
    }
  };

  appendChild(el: D3Element) {
    // if (el instanceof FauxElement) {
    el.parentNode = this;
    // }

    this.childNodes.push(el);
    return el;
  }

  insertBefore(el: D3Element, before: D3Element) {
    const index = this.childNodes.indexOf(before);
    el.parentNode = this;

    if (index !== -1) {
      this.childNodes.splice(index, 0, el);
    } else {
      this.childNodes.push(el);
    }

    return el;
  }

  removeChild(child: D3Element) {
    const target = this.childNodes.indexOf(child);
    this.childNodes.splice(target, 1);
    child.unmount();
  }

  querySelector(selector: string) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector: string) {
    if (!selector) {
      throw new Error("Not enough arguments");
    }

    return querySelectorAll(selector, this);
  }

  getElementsByTagName(nodeName: string): D3Element[] {
    const children = this.children;

    if (children.length === 0) {
      return [];
    } else {
      let matches;

      if (nodeName !== "*") {
        matches = children.filter((el) => el.nodeName === nodeName);
      } else {
        matches = children;
      }

      const childMatches = children.map((el) =>
        el.getElementsByTagName(nodeName)
      );

      return matches.concat.apply(matches, childMatches);
    }
  }
  getElementsByTagNameNS = (ns: string, nodeName: string) =>
    this.getElementsByTagName(nodeName);

  getElementById(id: string): D3Element | null {
    const children = this.children;

    if (children.length === 0) {
      return null;
    } else {
      const match = children.filter((el) => el.getAttribute("id") === id)[0];

      if (match) {
        return match;
      } else {
        const childMatches = children.map((el) => el.getElementById(id));

        return childMatches.filter((match) => match !== null)[0] || null;
      }
    }
  }
  getElementByIdNS = (ns: string, id: string) => this.getElementById(id);

  cloneNode(deep: boolean = true): D3Element {
    const el = new D3Element(
      this.nodeName,
      this.parentNode,
      this.nodeType,
      this.getAttr(),
      this.getStyle()
    );

    if (deep) {
      el.childNodes = this.childNodes.map((c) => {
        const childEl = c.cloneNode(true);
        childEl.parentNode = el;
        return childEl;
      });
    }
    return el;
  }

  getBoundingClientRect = () => {
    if (!this.ref.current) {
      return undefined;
    }

    return this.ref.current.getBoundingClientRect();
  };

  compareDocumentPosition(other: D3Element): number {
    if (this === other) {
      return 0;
    }

    const referenceRoot = getRootNode(this);
    const otherRoot = getRootNode(other);

    if (referenceRoot !== otherRoot) {
      return DOCUMENT_POSITION.DISCONNECTED;
    }

    const result = eitherContains(this, other);
    if (result) {
      return result;
    }

    const first = getFirstNodeByOrder([referenceRoot], this, other);
    return first === this
      ? DOCUMENT_POSITION.FOLLOWING
      : first === other
      ? DOCUMENT_POSITION.PRECEDING
      : DOCUMENT_POSITION.DISCONNECTED;
  }

  get nextSibling() {
    const siblings = this.parentNode?.children;
    if (!siblings) return;
    const me = siblings.indexOf(this);
    return siblings[me + 1];
  }

  get previousSibling() {
    const siblings = this.parentNode?.children;
    if (!siblings) return;
    const me = siblings.indexOf(this);
    return siblings[me - 1];
  }

  get clientLeft() {
    return this.ref.current?.clientLeft;
  }
  get clientTop() {
    return this.ref.current?.clientTop;
  }

  get innerHTML() {
    return this.text;
  }
  set innerHTML(text: string) {
    this.text = text;
  }

  get textContent() {
    return this.text;
  }
  set textContent(text: string) {
    this.text = text;
    if (this.ref.current) {
      this.ref.current.textContent = text;
    }
  }

  get children() {
    // So far nodes created by this library are all of nodeType 1 (elements),
    // but this could change in the future.
    return this.childNodes.filter((el) => {
      if (!el.nodeType) {
        // It's a React element, we always add it
        return true;
      }

      // It's a HTML node. We want to filter to have only nodes with type 1
      return el.nodeType === ELEMENT_NODE;
    });
  }

  toReact(): React.ReactNode {
    const attrs = this.getAttr();
    const style = this.getStyle();

    const self = this;

    return createElement(
      D3Node,
      // @ts-expect-error
      {
        ref: this.mountRef,
        key: this.id,
      },
      [
        createElement(
          this.nodeName,
          {
            ...attrs,
            ...Object.keys(this.eventListeners).reduce((acc, k) => {
              acc[k] = mapEventListener(self, this.eventListeners[k]);
              return acc;
            }, {} as { [key: string]: (syntheticEvent: React.SyntheticEvent) => void }),
            style,
            ref: this.ref,
            key: this.id,
          },
          this.text || this.children.map((el) => el.toReact())
        ),
      ]
    );
  }
}

const FauxWindow = {
  getComputedStyle: (node: D3Element) => ({
    getPropertyValue: node.style.getPropertyValue,
  }),
};

const FauxDocument = {
  Element: D3Element,
  defaultView: FauxWindow,
  createElement: (nodeName: string) => new D3Element(nodeName),
  createElementNS: function (ns: string, nodeName: string) {
    return this.createElement(nodeName);
  },
  // The selector engine tries to validate with this, but we don't care.
  // 8 = DOCUMENT_POSITION_CONTAINS, so we say all nodes are in this document.
  compareDocumentPosition: () => DOCUMENT_POSITION.CONTAINS,
};

// @ts-expect-error
D3Element.prototype.ownerDocument = FauxDocument;