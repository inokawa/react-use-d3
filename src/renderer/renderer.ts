import React from "react";
import { reconciler } from "./reconciler";

const containers = new Map<HTMLElement, any>();

export default {
  render(elem: React.ReactNode, root: HTMLElement): void {
    let container = containers.get(root);
    if (!container) {
      container = reconciler.createContainer(root, 0, false, null);
      containers.set(root, container);
    }

    reconciler.updateContainer(elem, container, null, () => undefined);
  },
  unmountComponentAtNode(root: HTMLElement) {
    if (containers.has(root)) {
      reconciler.updateContainer(null, containers.get(root), null, () => {
        containers.delete(root);
      });
    }
  },
};
