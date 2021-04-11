import { FauxElement } from "./_element";
import { FauxWindow } from "./_window";
import { DOCUMENT_POSITION_CONTAINS } from "./constants";
// import withFauxDOM from "./_withFauxDOM";

function factory() {
  const ReactFauxDOM = {
    Element: FauxElement,
    defaultView: FauxWindow,
    // withFauxDOM: withFauxDOM(FauxElement),
    createElement: function (nodeName: string) {
      return new FauxElement(nodeName);
    },
    createElementNS: function (namespace: string, nodeName: string) {
      return this.createElement(nodeName);
    },
    compareDocumentPosition: function () {
      // The selector engine tries to validate with this, but we don't care.
      // 8 = DOCUMENT_POSITION_CONTAINS, so we say all nodes are in this document.
      return DOCUMENT_POSITION_CONTAINS;
    },
  };

  FauxElement.prototype.ownerDocument = ReactFauxDOM;
  return ReactFauxDOM;
}

export default factory;
