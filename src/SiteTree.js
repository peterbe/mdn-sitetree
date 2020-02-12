import React, { useState, useEffect } from "react";
import { Treebeard } from "react-treebeard";

import "./SiteTree.css";

export default function SiteTree() {
  const [data, setData] = useState({});
  const [cursor, setCursor] = useState(false);

  useEffect(() => {
    let dismounted = false;
    fetch("tree.json").then(r => {
      if (!r.ok) {
        console.log(r);
        throw new Error("Not ok");
      }
      if (!r.headers.get("content-type").includes("application/json")) {
        throw new Error(`not json ${r.headers.get("content-type")}`);
      }
      r.json().then(d => {
        if (!dismounted) setData(d);
      });
    });
    return () => {
      dismounted = true;
    };
  }, []);

  function onToggle(node, toggled) {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setData(Object.assign({}, data));
  }
  return (
    <div id="wrapper">
      <Treebeard data={data} onToggle={onToggle} />
    </div>
  );
}
