import React from "react";
import renderer from "react-test-renderer";
import { D3Element } from "./";

describe("react-dom", () => {
  it("normal", () => {
    const root = new D3Element("svg", undefined, true);
    root.setAttribute("width", "600");
    root.setAttribute("height", "400");
    root.style.setProperty("width", "600px");
    root.style.setProperty("height", "400px");
    const child = new D3Element("g");
    const rect = new D3Element("rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100");
    rect.setAttribute("height", "100");
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "red");
    rect.setAttribute("stroke-width", "1");
    const text = new D3Element("text");
    text.textContent = "test";
    root.appendChild(child);
    child.appendChild(rect);
    child.appendChild(text);
    const component = renderer.create(root.toReact());
    expect(component.toJSON()).toMatchSnapshot();
  });
});
