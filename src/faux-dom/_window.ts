import { FauxElement } from "./_element";

function window() {
  var Window = {
    getComputedStyle: function (node: FauxElement) {
      return {
        getPropertyValue: node.style.getProperty,
      };
    },
  };

  return Window;
}

export const FauxWindow = window();
