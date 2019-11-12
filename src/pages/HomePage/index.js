import React, { Component, Fragment } from "react";
import Helmet from "react-helmet";
import Cabecalho from "../../components/Cabecalho";
import Dashboard from "../../components/Dashboard";
import NavMenu from "../../components/NavMenu";
import TrendsArea from "../../components/TrendsArea";
import Tweet from "../../components/Tweet";
import Widget from "../../components/Widget";
import { Modal } from "../../components/Modal";
import { TweetsService } from "../../services/TweetsService";
import { ReactReduxContext } from "react-redux";

class HomePage extends Component {
  static contextType = ReactReduxContext;

  constructor() {
    super();
    this.state = {
      novoTweet: "",
      tweets: [],
      tweetAtivoNoModal: {}
    };
  }

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
        tweets: store.getState()
      });
    });
    TweetsService.carrega().then(tweets => {
      store.dispatch({ type: "CARREGA_TWEETS", tweets });
    });
  }

  adicionaTweet = infosDoEvento => {
    infosDoEvento.preventDefault();
    if (this.state.novoTweet.length > 0) {
      TweetsService.adiciona(this.state.novoTweet).then(
        tweetVindoDoServidor => {
          console.log(tweetVindoDoServidor);
          this.setState({
            tweets: [tweetVindoDoServidor, ...this.state.tweets]
          });
        }
      );
    }
  };

  removeTweet(idTweetQueVaiSerRemovido) {
    TweetsService.remove(idTweetQueVaiSerRemovido).then(response => {
      console.log(response);
      const listaDeTweetsAtualizada = this.state.tweets.filter(
        tweet => tweet._id !== idTweetQueVaiSerRemovido
      );
      this.setState({
        tweets: listaDeTweetsAtualizada
      });
      this.fechaModal();
    });
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Twitelum - ({`${this.state.tweets.length}`})</title>
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
              <div className="tweetsArea">
                {this.state.tweets.map(tweetInfo => {
                  return (
                    <Tweet
                      key={tweetInfo._id}
                      id={tweetInfo._id}
                      texto={tweetInfo.conteudo}
                      usuario={tweetInfo.usuario}
                      likeado={tweetInfo.likeado}
                      totalLikes={tweetInfo.totalLikes}
                      removivel={tweetInfo.removivel}
                      onClickNaAreaDeConteudo={() => this.abreModal(tweetInfo)}
                      removeHandler={() => this.removeTweet(tweetInfo._id)}
                    />
                  );
                })}
              </div>
            </Widget>
          </Dashboard>
        </div>
        <Modal
          isAberto={Boolean(this.state.tweetAtivoNoModal._id)}
          onFechando={this.fechaModal}
        >
          {() => (
            <Tweet
              id={this.state.tweetAtivoNoModal._id}
              usuario={this.state.tweetAtivoNoModal.usuario}
              texto={this.state.tweetAtivoNoModal.conteudo}
              totalLikes={this.state.tweetAtivoNoModal.totalLikes}
              removivel={this.state.tweetAtivoNoModal.removivel}
              likes={this.state.tweetAtivoNoModal.likes}
              removeHandler={() =>
                this.removeTweet(this.state.tweetAtivoNoModal._id)
              }
              likeado={this.state.tweetAtivoNoModal.likeado}
            />
          )}
        </Modal>
      </Fragment>
    );
  }
}

export default HomePage;
