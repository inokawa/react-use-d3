// @ts-expect-error
import ReactReconciler from "react-reconciler";
import * as d3 from "d3";

type Container = HTMLElement;

type Type = string; // TODO

type Instance = {
  el: HTMLElement;
  props: any;
  children: [];
};

type TextInstance = { el: Text };

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
  ): Instance {
    const el = document.createElement(type);

    return { el, props, children: [] };
  },
  createTextInstance(
    text: string,
    rootContainer: Container,
    hostContext: any,
    internalHandle: any
  ): TextInstance {
    return { el: document.createTextNode(text) };
  },

  appendChildToContainer(container: Container, child: Instance) {
    const sel = d3.select(container).append(() => child.el);
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  appendChild(parent: Instance, child: Instance) {
    const sel = d3.select(parent.el).append(() => child.el);
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  appendInitialChild(parent: Instance, child: Instance) {
    const sel = d3.select(parent.el).append(() => child.el);
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },

  insertInContainerBefore(
    container: Container,
    child: Instance,
    before: Instance
  ) {
    const sel = d3.select(container).insert(
      () => child.el,
      () => before.el
    );
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  insertBefore(parent: Instance, child: Instance, before: Instance) {
    const sel = d3.select(parent.el).insert(
      () => child.el,
      () => before.el
    );
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },

  prepareUpdate(
    instance: Instance,
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
    instance: Instance,
    updatePayload: UpdatePayload,
    type: Type,
    oldProps: any,
    newProps: any,
    finishedWork: any
  ) {
    if (instance.el.nodeType === 1) {
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

  removeChildFromContainer(container: Container, child: Instance) {
    d3.select(child.el).transition().style("opacity", 0).remove();
  },
  removeChild(parent: Instance, child: Instance) {
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
    instance: Instance,
    type: Type,
    props: any,
    rootContainer: Container,
    hostContext: any
  ) {
    return false;
  },
  commitMount(
    instance: Instance,
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
