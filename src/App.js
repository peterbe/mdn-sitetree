import React from "react";
import "./App.css";
import SiteTree from "./SiteTree";

function App() {
  return (
    <div className="App">
      <header className="App-header">MDN SiteTree</header>

      <section className="App-main">
        <SiteTree />
      </section>

      <footer className="App-footer">
        <p>
          Code:{" "}
          <a href="https://github.com/peterbe/mdn-sitetree/">
            https://github.com/peterbe/mdn-sitetree/
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
