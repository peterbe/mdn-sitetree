import React from "react";
import "./App.css";
import SiteTree from "./SiteTree";

function App() {
  return (
    <div className="App">
      <header className="App-header">MDN SiteTree</header>

      <section classname="App-main">
        <SiteTree />
      </section>
    </div>
  );
}

export default App;
