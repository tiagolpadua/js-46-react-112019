import React, { Component, Fragment } from "react";
import Cabecalho from "./components/Cabecalho";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Cabecalho usuario="@omariosouto" />
        Resto da página que ainda iremos adicionar
      </Fragment>
    );
  }
}

export default App;
