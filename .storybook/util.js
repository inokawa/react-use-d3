import * as d3 from "d3-array";

export const getRangedData = (max) => {
  const list = [];
  const arr = d3.range(0, Math.ceil(Math.random() * 30));
  for (let i = 0; i < arr.length; i++) {
    list.push({
      name: arr[i] * 10,
      value: Math.floor(Math.random() * Math.random() * max),
    });
  }
  return list;
};

export const getRandom2dData = (xMax, yMax) => {
  const list = [];
  const length = Math.ceil(Math.random() * 50);
  for (let i = 0; i < length; i++) {
    list.push({
      x: Math.floor(Math.random() * Math.random() * xMax),
      y: Math.floor(Math.random() * Math.random() * yMax),
      name: i,
    });
  }
  d3.shuffle(list);
  return list;
};
