import React, { Component, Fragment } from "react";
import { TweetsThunkActions } from "../store/ducks/tweets";
import Tweet from "../components/Tweet";
import { Modal } from "../components/Modal";
import { ReactReduxContext } from "react-redux";
export class TweetsContainer extends Component {
  state = {
    tweets: [],
    tweetAtivoNoModal: {}
  };

  static contextType = ReactReduxContext;

  componentDidMount() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        tweets: store.getState().tweets.data
      });
    });
    store.dispatch(TweetsThunkActions.carregaTweets());
  }

  removeTweet(idTweetQueVaiSerRemovido) {
    this.context.store
      .dispatch(TweetsThunkActions.remove(idTweetQueVaiSerRemovido))
      .then(() => {
        this.fechaModal();
      });
  }

  fechaModal = () => this.setState({ tweetAtivoNoModal: {} });

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

  render() {
    return (
      <Fragment>
        <div className="tweetsArea">
          {this.state.tweets.map((tweetInfo, index) => {
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
