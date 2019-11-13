import React, { Component, Fragment } from "react";
import Helmet from "react-helmet";
import { ReactReduxContext } from "react-redux";
import Cabecalho from "../../components/Cabecalho";
import Dashboard from "../../components/Dashboard";
import { Modal } from "../../components/Modal";
import NavMenu from "../../components/NavMenu";
import TrendsArea from "../../components/TrendsArea";
import Tweet from "../../components/Tweet";
import Widget from "../../components/Widget";
import { TweetsContainer } from "../../containers/TweetsContainer";
import { TweetsThunkActions } from "../../store/ducks/tweets";

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      novoTweet: "",
      totalTweets: 0
    };
  }

  static contextType = ReactReduxContext;

  abreModal = tweetQueVaiProModal => {
    this.setState(
      {
        tweetAtivoNoModal: tweetQueVaiProModal
      },
      () => {
        console.log(this.state.tweetAtivoNoModal);
      }
    );
  };

  fechaModal = () => this.setState({ tweetAtivoNoModal: {} });

  componentDidMount() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        totalTweets: store.getState().tweets.data.length
      });
    });
  }

  adicionaTweet = infosDoEvento => {
    infosDoEvento.preventDefault();
    if (this.state.novoTweet.length > 0) {
      const conteudoDoTweet = this.state.novoTweet;
      this.context.store
        .dispatch(TweetsThunkActions.addTweet(conteudoDoTweet))
        .then(() => {
          this.setState({ novoTweet: "" });
        });
    }
  };

  removeTweet(idTweetQueVaiSerRemovido) {
    this.context.store
      .dispatch(TweetsThunkActions.remove(idTweetQueVaiSerRemovido))
      .then(() => {
        this.fechaModal();
      });
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Twitelum - ({`${this.state.totalTweets}`})</title>
        </Helmet>
        <Cabecalho>
          <NavMenu usuario="@omariosouto" />
        </Cabecalho>
        <div className="container">
          <Dashboard>
            <Widget>
              <form className="novoTweet" onSubmit={this.adicionaTweet}>
                <div className="novoTweet__editorArea">
                  <span
                    className={`novoTweet__status ${
                      this.state.novoTweet.length > 140
                        ? "novoTweet__status--invalido"
                        : ""
                    }`}
                  >
                    {this.state.novoTweet.length}/140
                  </span>
                  <textarea
                    className="novoTweet__editor"
                    value={this.state.novoTweet}
                    onChange={event =>
                      this.setState({ novoTweet: event.target.value })
                    }
                    placeholder="O que está acontecendo?"
                  ></textarea>
                </div>
                <button
                  className="novoTweet__envia"
                  disabled={
                    this.state.novoTweet.length > 140 ||
                    this.state.novoTweet.length === 0
                  }
                  type="submit"
                >
                  Tweetar
                </button>
              </form>
            </Widget>
            <Widget>
              <TrendsArea />
            </Widget>
          </Dashboard>
          <Dashboard posicao="centro">
            <Widget>
              <TweetsContainer />
            </Widget>
          </Dashboard>
        </div>
      </Fragment>
    );
  }
}

export default HomePage;
