// @ts-expect-error
import ReactReconciler from "react-reconciler";
import * as d3 from "d3";

type Container = HTMLElement;

type Type = string; // TODO

type ElemInstance = {
  type: "elem";
  el: HTMLElement;
  props: any;
  children: [];
};

type TextInstance = {
  type: "text";
  el: Text;
};

type UpdatePayload = {
  [key: string]: any;
};

const applyD3Props = (sel: any, el: HTMLElement, props: UpdatePayload) => {
  for (const k of Object.keys(props)) {
    if (k === "children") continue;
    if (k.startsWith("on") && typeof props[k] === "function") {
      d3.select(el).on(k.slice(2).toLowerCase(), props[k]);
    } else {
      if (k === "className") {
        el[k] = props[k];
      } else if (k === "style") {
        Object.keys(props.style).forEach((k) => {
          sel.style(k, props.style[k]);
        });
      } else {
        sel.attr(k, props[k]);
      }
    }
  }
};

export const reconciler = ReactReconciler({
  supportsMutation: true,

  createInstance(
    type: Type,
    props: any,
    rootContainer: Container,
    hostContext: any,
    internalHandle: any
  ): ElemInstance {
    const el = document.createElement(type);

    return { type: "elem", el, props, children: [] };
  },
  createTextInstance(
    text: string,
    rootContainer: Container,
    hostContext: any,
    internalHandle: any
  ): TextInstance {
    return { type: "text", el: document.createTextNode(text) };
  },

  appendChildToContainer(container: Container, child: ElemInstance) {
    const sel = d3.select(container).append(() => child.el);
    if (child.type === "elem") {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  appendChild(parent: ElemInstance, child: ElemInstance) {
    const sel = d3.select(parent.el).append(() => child.el);
    if (child.type === "elem") {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  appendInitialChild(parent: ElemInstance, child: ElemInstance) {
    const sel = d3.select(parent.el).append(() => child.el);
    if (child.type === "elem") {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },

  insertInContainerBefore(
    container: Container,
    child: ElemInstance,
    before: ElemInstance
  ) {
    const sel = d3.select(container).insert(
      () => child.el,
      () => before.el
    );
    if (child.type === "elem") {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  insertBefore(
    parent: ElemInstance,
    child: ElemInstance,
    before: ElemInstance
  ) {
    const sel = d3.select(parent.el).insert(
      () => child.el,
      () => before.el
    );
    if (child.type === "elem") {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },

  prepareUpdate(
    instance: ElemInstance,
    type: Type,
    oldProps: any,
    newProps: any,
    rootContainer: Container,
    hostContext: any
  ): UpdatePayload | null {
    const payload: UpdatePayload = {};
    for (const k of Object.keys({ ...oldProps, ...newProps })) {
      if (oldProps[k] !== newProps[k]) payload[k] = newProps[k];
    }
    return Object.keys(payload).length === 0 ? null : payload;
  },
  commitUpdate(
    instance: ElemInstance,
    updatePayload: UpdatePayload,
    type: Type,
    oldProps: any,
    newProps: any,
    finishedWork: any
  ) {
    if (instance.type === "elem") {
      const sel = d3.select(instance.el).transition();
      applyD3Props(sel, instance.el, updatePayload);
    }
  },
  commitTextUpdate(instance: TextInstance, oldText: string, newText: string) {
    if (oldText !== newText) {
      // TODO textTween
      instance.el.textContent = newText;
    }
  },

  removeChildFromContainer(container: Container, child: ElemInstance) {
    d3.select(child.el).transition().style("opacity", 0).remove();
  },
  removeChild(parent: ElemInstance, child: ElemInstance) {
    d3.select(child.el).transition().style("opacity", 0).remove();
  },

  clearContainer(container: Container) {
    let c = container.firstChild;
    while (c) {
      container.removeChild(c);
      c = container.firstChild;
    }
  },

  finalizeInitialChildren(
    instance: ElemInstance,
    type: Type,
    props: any,
    rootContainer: Container,
    hostContext: any
  ) {
    return false;
  },
  commitMount(
    instance: ElemInstance,
    type: Type,
    props: any,
    internalHandle: any
  ) {},

  getRootHostContext(rootContainer: Container) {
    return null;
  },
  getChildHostContext(
    parentHostContext: any,
    type: Type,
    rootContainer: Container
  ) {
    return parentHostContext;
  },
  getPublicInstance(instance: any) {
    return instance;
  },
  prepareForCommit(containerInfo: any) {
    return null;
  },
  resetAfterCommit(containerInfo: any) {},
  shouldSetTextContent(type: Type, props: any) {
    return false;
  },
  resetTextContent(instance: TextInstance) {},
});
