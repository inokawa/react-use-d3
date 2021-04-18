# react-use-d3

![npm](https://img.shields.io/npm/v/react-use-d3) ![check](https://github.com/inokawa/react-use-d3/workflows/check/badge.svg) ![demo](https://github.com/inokawa/react-use-d3/workflows/demo/badge.svg)

A small [React](https://github.com/facebook/react) hook to use [D3](https://github.com/d3/d3) in declarative way, for data visualization & flexible animation.

**This is under development and APIs are not fixed**

## Why?

D3 is an excellent library to do data-driven visualization.
React is a nice library to create user interfaces in data-driven way.
So why not use them together?

Well, integrating D3 into React was tried by many but it looks that no one succeeded to do it perfectly. I think it's because of many mismatches between them.

- React does DOM manipulation through virtual DOM but D3 does it directly with its own data binding system.
- React is only for UI but D3 has everything for visualization.
- React uses JSX but D3 doesn't (React's hook feels similar to D3 way in my opinion).
- React's reconciliation misses some values interpolated by D3.

I'm trying to give a nice intermediate with this lib.
Almost all syntaxes of D3 would work.
The elements created with D3 are transformed into React Elements and handled by React's reconciliation.
Attribute updates are applied directly through ref for smooth animation.

The core of this lib is based on [react-faux-dom](https://github.com/Olical/react-faux-dom), but customized to fit to the lifecycle of React and handle D3's transition correctly. Also rewritten in TypeScript and fixed to support newest D3.

I'm trying to support D3's usecases as much as possible. If you notice some problems, I would appreciate if you could report it in a [issue](https://github.com/inokawa/react-use-d3/issues).

## Demo

https://inokawa.github.io/react-use-d3/

## Install

```sh
npm install react-use-d3
```

### Requirements

- react >= 16.8
- d3 >= 4

## Usage

TODO

## Limitations

TODO

## TODOs

- [ ] Fix API
- [ ] Confirm that it works with...
  - [x] d3-selection
  - [x] d3-transition
  - [x] d3-scale
  - [x] d3-interpolate
  - [ ] d3-hierarchy
  - [ ] d3-shape
  - [ ] d3-path
  - [ ] d3-chord
  - [ ] d3-axis
  - [ ] d3-drag
  - [ ] d3-brush
  - [ ] d3-zoom
  - [ ] d3-force
  - [ ] d3-contour
  - [ ] d3-geo
  - [ ] d3-tile
  - [ ] d3-quadtree
  - [ ] d3-delaunay
  - [ ] d3-dag
  - etc.
- [ ] Support canvas
- [ ] Support React Native
- [ ] Consider examples
- [ ] Consider dependencies
- [ ] Consider tests
