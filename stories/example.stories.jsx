import React, { Fragment, useState } from "react";
import Bars from "./observable/bars";
import Force from "./observable/force";
import Stream, { options as streamOptions } from "./observable/stream";
import TransitionCircle from "./observable/transition-end";
import {
  TweenNumber,
  TweenFormattedNumber,
  TweenTextAppearance,
} from "./observable/transition-texttween";

export default {
  title: "example",
};

export const StackedToGroupedBars = () => {
  const url = "https://observablehq.com/@d3/stacked-to-grouped-bars";
  const [layout, setLayout] = useState("stacked");

  return (
    <div>
      <a href={url}>{url}</a>
      <div>
        {["stacked", "grouped"].map((l) => (
          <Fragment key={l}>
            <input
              type="radio"
              id={l}
              name={l}
              onChange={() => setLayout(l)}
              checked={l === layout}
            />
            <label htmlFor={l}>{l}</label>
          </Fragment>
        ))}
      </div>
      <Bars width={900} height={500} layout={layout} />
    </div>
  );
};

export const ForceDirectedGraph = () => {
  const url = "https://observablehq.com/@d3/force-directed-graph";
  const data = require("./miserables.json");

  return (
    <div>
      <a href={url}>{url}</a>
      <Force width={900} height={600} data={data} />
    </div>
  );
};

export const StreamGraph = () => {
  const url = "https://observablehq.com/@d3/streamgraph-transitions";
  const [mode, setMode] = useState(streamOptions[3].name);

  return (
    <div>
      <a href={url}>{url}</a>
      <div>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          {streamOptions.map((o) => (
            <option key={o.name} value={o.name}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
      <Stream width={900} height={500} mode={mode} />
    </div>
  );
};

export const TransitionEnd = () => {
  const url = "https://observablehq.com/@d3/transition-end";

  return (
    <div>
      <a href={url}>{url}</a>
      <TransitionCircle />
    </div>
  );
};

export const TransitionTexttween = () => {
  const url = "https://observablehq.com/@d3/transition-texttween";

  return (
    <div>
      <a href={url}>{url}</a>
      <TweenNumber />
      <TweenFormattedNumber />
      <TweenTextAppearance />
    </div>
  );
};