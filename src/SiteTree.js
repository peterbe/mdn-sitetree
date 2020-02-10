import React from "react";
import Tree from "react-d3-tree";

import "./SiteTree.css";

const myTreeData = [
  {
    name: "Top Level",
    attributes: {
      keyA: "val A",
      keyB: "val B",
      keyC: "val C"
    },
    children: [
      {
        name: "Level 2: A",
        attributes: {
          keyA: "val A",
          keyB: "val B",
          keyC: "val C"
        }
      },
      {
        name: "Level 2: B"
      }
    ]
  }
];

export default function SiteTree() {
  /* <Tree /> will fill width/height of its container; in this case `#treeWrapper` */
  return (
    <div id="tree-wrapper">
      <Tree data={myTreeData} orientation="horizontal" />
    </div>
  );
}
