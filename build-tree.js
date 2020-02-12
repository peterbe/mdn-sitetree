const fs = require("fs");
const path = require("path");

const CUTOFF = 15;
const MAX_DEPTH = 4;

function main(rootDir) {
  console.time("Gathering");
  const children = getChildren(rootDir, toggleByDefault);
  children.sort((a, b) => b.count - a.count);
  const data = {
    name: "/",
    toggled: true,
    children: children
  };
  console.timeEnd("Gathering");
  // console.log(JSON.stringify(data, null, 3));
  const fn = path.join("public", "tree.json");
  fs.writeFileSync(fn, JSON.stringify(data, null, 2), "utf8");
  console.log(
    `Wrote ${fn} ${(fs.statSync(fn).size / 1024 / 1024).toFixed(1)}MB`
  );
}

function toggleByDefault(filepath, name) {
  return (
    filepath.endsWith("en-us") ||
    filepath.endsWith("en-us/web") ||
    filepath.endsWith("en-us/web/css")
  );
}

function getChildren(root, toggleByDefault, depth = 0) {
  const files = fs.readdirSync(root);
  const children = [];
  for (const name of files) {
    const filepath = path.join(root, name);

    const isDirectory = fs.statSync(filepath).isDirectory();

    if (isDirectory) {
      let subChildren = [];
      if (depth < MAX_DEPTH) {
        subChildren = getChildren(filepath, toggleByDefault, depth + 1);
      }
      const filesCount = countFiles(filepath);
      let child = {
        name: `${name} (${filesCount.toLocaleString()} files`,
        count: filesCount
      };
      if (toggleByDefault(filepath, name)) {
        child.toggled = true;
      }
      if (subChildren.length) {
        subChildren.sort((a, b) => b.count - a.count);
        if (subChildren.length > CUTOFF) {
          const rest = subChildren.splice(CUTOFF, subChildren.length);
          const combinedSum = rest.reduce((a, b) => a + b.count, 0);
          const combined = {
            name: `*REST* (${combinedSum.toLocaleString()} files`,
            count: combinedSum
          };
          subChildren.push(combined);
        }
        // const totalSum = subChildren.reduce((a, b) => a + b.count, 0);
        // subChildren.forEach(c => {
        //   const p = (100 * c.count) / totalSum;
        //   c.name = `${c.name} ${p.toFixed(1)}%)`;
        // });
        child.children = subChildren;
      }
      children.push(child);
    }
  }
  const totalSum = children.reduce((a, b) => a + b.count, 0);
  children.forEach(c => {
    const p = (100 * c.count) / totalSum;
    c.name = `${c.name} ${p.toFixed(1)}%)`;
  });
  return children;
}

function countFiles(root) {
  let count = 0;
  const files = fs.readdirSync(root);
  for (const name of files) {
    if (name === "index.yaml") {
      count++;
    } else {
      const filepath = path.join(root, name);
      const isDirectory = fs.statSync(filepath).isDirectory();
      if (isDirectory) {
        count += countFiles(filepath);
      }
    }
  }
  return count;
}
main(process.argv[2]);
