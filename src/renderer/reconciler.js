import ReactReconciler from "react-reconciler";

const ATTRS = ["style", "alt", "className", "href", "rel", "src", "target"];

const applyProps = (el, props, k) => {
  if (k.startsWith("on") && typeof props[k] === "function") {
    el.addEventListener(k.slice(2).toLowerCase(), props[k]);
  } else if (ATTRS.includes(k)) {
    if (k === "className") {
      el[k] = props[k];
    } else if (k === "style") {
      Object.keys(props.style).forEach((k) => {
        el.style[k] = props.style[k];
      });
    } else {
      el[k] = props[k];
    }
  }
};

export const reconciler = ReactReconciler({
  supportsMutation: true,

  createInstance(type, props, rootContainer, hostContext, internalHandle) {
    const el = document.createElement(type);
    Object.keys(props).forEach((k) => {
      applyProps(el, props, k);
    });

    return el;
  },
  createTextInstance(text, rootContainer, hostContext, internalHandle) {
    return document.createTextNode(text);
  },

  appendChildToContainer(container, child) {
    container.appendChild(child);
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  appendInitialChild(parent, child) {
    parent.appendChild(child);
  },

  removeChildFromContainer(container, child) {
    container.removeChild(child);
  },
  removeChild(parent, child) {
    parent.removeChild(child);
  },
  insertInContainerBefore(container, child, before) {
    container.insertBefore(child, before);
  },
  insertBefore(parent, child, before) {
    parent.insertBefore(child, before);
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
    ATTRS.forEach((k) => {
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
    Object.keys(updatePayload).forEach((k) => {
      applyProps(instance, updatePayload, k);
    });
  },
  commitTextUpdate(instance, oldText, newText) {
    if (oldText !== newText) instance.textContent = newText;
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
