import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage = ({ location }) => {
  console.log(location);
  return (
    <div className="container">
      A URL <strong>{location.pathname}</strong> não existe no Twitelum, se
      quiser voltar para a <Link to="/">página inicial basta clicar aqui</Link>
    </div>
  );
};
export default NotFoundPage;
