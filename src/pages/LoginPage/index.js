import React, { Component, Fragment } from "react";
import Cabecalho from "../../components/Cabecalho";
import Widget from "../../components/Widget";
import { NotificacaoContext } from "../../context/NotificacaoContext";
import { LoginService } from "../../services/LoginService";
import { FormManager } from "../../components/FormManager";
import "./loginPage.css";

const InputFormField = ({
  id,
  label,
  errors,
  touched,
  values,
  onChange,
  onBlur,
  type
}) => {
  const isTouched = Boolean(touched[id]);
  const hasErrors = Boolean(errors[id]);
  console.log(id + "", "touched:", touched[id], "errors: ", errors[id] + "");
  return (
    <div className="loginPage__inputWrap">
      <label className="loginPage__label" htmlFor={id}>
        {label}
      </label>
      <input
        className="loginPage__input"
        type={type}
        id={id}
        name={id}
        value={values[id]}
        onChange={onChange}
        onBlur={onBlur}
      />
      <p style={{ color: "red" }}>{isTouched && hasErrors && errors[id]}</p>
    </div>
  );
};

class LoginPage extends Component {
  static contextType = NotificacaoContext;

  state = {};

  fazerLogin = (infosDoEvento, values) => {
    infosDoEvento.preventDefault();
    const dadosDeLogin = {
      login: values.inputLogin,
      senha: values.inputSenha
    };
    LoginService.logar(dadosDeLogin)
      .then(() => {
        this.context.setMsg("Bem vindo ao Twitelum, login foi um sucesso!");
        this.props.history.push("/");
      })
      .catch(err => {
        console.error(`[Erro ${err.status}]`, err.message);
      });
  };

  render() {
    return (
      <Fragment>
        <Cabecalho />
        <div className="loginPage">
          <div className="container">
            <Widget>
              <h2 className="loginPage__title">Seja bem vindo!</h2>
              <FormManager
                initialValues={{ inputLogin: "", inputSenha: "" }}
                onFormValidation={values => {
                  const errors = {};
                  if (!values.inputLogin)
                    errors.inputLogin = "Esse campo é obrigatório";
                  if (!values.inputSenha)
                    errors.inputSenha = "Esse campo é obrigatório";
                  return errors;
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  onFormFieldChange,
                  onFormFieldBlur
                }) => (
                  <form
                    className="loginPage__form"
                    action="/"
                    onSubmit={event => this.fazerLogin(event, values)}
                  >
                    <InputFormField
                      id="inputLogin"
                      label="Login:	"
                      onChange={onFormFieldChange}
                      onBlur={onFormFieldBlur}
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                    <InputFormField
                      id="inputSenha"
                      label="Senha:	"
                      onChange={onFormFieldChange}
                      onBlur={onFormFieldBlur}
                      values={values}
                      errors={errors}
                      touched={touched}
                      type="password"
                    />
                    {this.state.msgErro && (
                      <div className="loginPage__errorBox">
                        {this.state.msgErro}
                      </div>
                    )}
                    <div className="loginPage__inputWrap">
                      <button className="loginPage__btnLogin" type="submit">
                        Logar
                      </button>
                    </div>
                  </form>
                )}
              </FormManager>
            </Widget>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default LoginPage;
