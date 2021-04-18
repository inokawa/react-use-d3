import React, { Fragment, useState } from "react";
import Bars from "./components/bars";
import LineChart from "./components/linechart";
import Force from "./components/force";
import Stream, { options as streamOptions } from "./components/stream";
import Sunburst from "./components/sunburst";
import TransitionCircle from "./components/transition-end";
import {
  TweenNumber,
  TweenFormattedNumber,
  TweenTextAppearance,
} from "./components/transition-texttween";
import TransitionChained from "./components/transition-chained";

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

export const MultiLineChart = () => {
  const url = "https://observablehq.com/@d3/multi-line-chart";

  return (
    <div>
      <a href={url}>{url}</a>
      <LineChart width={900} height={600} />
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

export const ZoomableSunburst = () => {
  const url = "https://observablehq.com/@d3/zoomable-sunburst";

  return (
    <div>
      <a href={url}>{url}</a>
      <Sunburst />
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

export const ChainedTransition = () => {
  const url = "https://bl.ocks.org/mbostock/70d5541b547cc222aa02";

  return (
    <div>
      <a href={url}>{url}</a>
      <TransitionChained />
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
