import ReactReconciler from "react-reconciler";
import * as d3 from "d3";

const applyD3Props = (sel, el, props) => {
  Object.keys(props).forEach((k) => {
    if (k === "children") return;
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
  });
};

export const reconciler = ReactReconciler({
  supportsMutation: true,

  createInstance(type, props, rootContainer, hostContext, internalHandle) {
    const el = document.createElement(type);

    return { el, props, children: [] };
  },
  createTextInstance(text, rootContainer, hostContext, internalHandle) {
    return { el: document.createTextNode(text) };
  },

  appendChildToContainer(container, child) {
    const sel = d3.select(container).append(() => child.el);
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  appendChild(parent, child) {
    const sel = d3.select(parent.el).append(() => child.el);
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  appendInitialChild(parent, child) {
    const sel = d3.select(parent.el).append(() => child.el);
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },

  removeChildFromContainer(container, child) {
    d3.select(child.el).transition().style("opacity", 0).remove();
  },
  removeChild(parent, child) {
    d3.select(child.el).transition().style("opacity", 0).remove();
  },
  insertInContainerBefore(container, child, before) {
    const sel = d3.select(container).insert(
      () => child.el,
      () => before.el
    );
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },
  insertBefore(parent, child, before) {
    const sel = d3.select(parent.el).insert(
      () => child.el,
      () => before.el
    );
    if (child.el.nodeType === 1) {
      sel.style("opacity", 0).transition().style("opacity", 1);
      applyD3Props(sel, child.el, child.props);
    }
  },

  clearContainer(container) {
    let c = container.firstChild;
    while (c) {
      container.removeChild(c);
      c = container.firstChild;
    }
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext
  ) {
    const payload = {};
    Object.keys({ ...oldProps, ...newProps }).forEach((k) => {
      if (oldProps[k] !== newProps[k]) payload[k] = newProps[k];
    });
    return Object.keys(payload).length === 0 ? null : payload;
  },
  commitUpdate(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork
  ) {
    if (instance.el.nodeType === 1) {
      const sel = d3.select(instance.el).transition();
      applyD3Props(sel, instance.el, updatePayload);
    }
  },
  commitTextUpdate(instance, oldText, newText) {
    if (oldText !== newText) instance.el.textContent = newText;
  },

  finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
    return false;
  },
  commitMount(instance, type, props, internalHandle) {},

  getRootHostContext(rootContainer) {
    return null;
  },
  getChildHostContext(parentHostContext, type, rootContainer) {
    return parentHostContext;
  },
  getPublicInstance(instance) {
    return instance;
  },
  prepareForCommit(containerInfo) {
    return null;
  },
  resetAfterCommit(containerInfo) {},
  shouldSetTextContent(type, props) {
    return false;
  },
  resetTextContent(instance) {},
});
