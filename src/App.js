import React, { Component } from "react";
import "./App.css";
import Cabecalho from "./components/Cabecalho";
import NavMenu from "./components/NavMenu";

class App extends Component {
  render() {
    return (
      <Cabecalho>
        <NavMenu usuario="@omariosouto" />
      </Cabecalho>
    );
  }
}

export default App;
