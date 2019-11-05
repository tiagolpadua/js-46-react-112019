import React from "react";
import { Switch, Route } from "react-router-dom";
//	Páginas
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
class Roteamento extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/login" component={LoginPage} />
      </Switch>
    );
  }
}
export default Roteamento;
