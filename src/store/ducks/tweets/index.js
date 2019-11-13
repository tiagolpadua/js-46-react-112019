import { TweetsService } from "../../../services/TweetsService";
export const TweetsThunkActions = {
  carregaTweets: () => {
    return dispatch => {
      dispatch({ type: "tweets/CARREGA" });
      TweetsService.carrega()
        .then(tweets => {
          dispatch({
            type: "tweets/CARREGA_SUCESSO",
            payload: { data: tweets }
          });
        })
        .catch(() => {
          dispatch({ type: "tweets/CARREGA_FALHOU" });
        });
    };
  },
  addTweet: conteudo => {
    return async dispatch => {
      const response = await TweetsService.adiciona(conteudo);
      dispatch({ type: "tweets/ADD", payload: { tweet: response } });
    };
  },
  remove: idTweetQueVaiSerRemovido => {
    return async dispatch => {
      await TweetsService.remove(idTweetQueVaiSerRemovido);
      dispatch({
        type: "tweets/REMOVE",
        payload: { idDoTweet: idTweetQueVaiSerRemovido }
      });
    };
  },
  setTweetAtivo: idDoTweet => {
    return dispatch => {
      dispatch({
        type: "tweets/SET_TWEET_ATIVO",
        payload: { idDoTweet }
      });
    };
  },
  unsetTweetAtivo: idDoTweet => {
    return dispatch => {
      dispatch({
        type: "tweets/UNSET_TWEET_ATIVO"
      });
    };
  },
  like: idDoTweet => {
    return async dispatch => {
      dispatch({
        type: "tweets/LIKE",
        payload: { idDoTweet }
      });
      await TweetsService.like(idDoTweet);
    };
  }
};
const INITIAL_STATE = {
  data: [],
  loading: false,
  error: false,
  activeDataItem: {}
};
export function tweetsReducer(state = INITIAL_STATE, action = {}) {
  if (action.type === "tweets/CARREGA") {
    return {
      ...state,
      loading: true
    };
  }
  if (action.type === "tweets/CARREGA_SUCESSO") {
    const tweets = action.payload.data;
    return {
      ...state,
      data: tweets,
      error: false
    };
  }
  if (action.type === "tweets/CARREGA_FALHOU") {
    return {
      ...state,
      data: [],
      error: true
    };
  }

  if (action.type === "tweets/ADD") {
    return {
      ...state,
      data: [action.payload.tweet, ...state.data],
      error: true
    };
  }

  if (action.type === "tweets/REMOVE") {
    const listaDeTweetsAtualizada = state.data.filter(
      tweet => tweet._id !== action.payload.idDoTweet
    );
    return {
      ...state,
      activeDataItem: {},
      data: listaDeTweetsAtualizada
    };
  }

  if (action.type === "tweets/SET_TWEET_ATIVO") {
    const idActiveTweet = action.payload.idDoTweet;
    const activeTweet = state.data.find(item => item._id === idActiveTweet);
    return {
      ...state,
      activeDataItem: activeTweet
    };
  }

  if (action.type === "tweets/UNSET_TWEET_ATIVO") {
    return {
      ...state,
      activeDataItem: {}
    };
  }

  if (action.type === "tweets/LIKE") {
    const idDoTweetLikeado = action.payload.idDoTweet;
    const stateParcial = state.data.reduce(
      (stateParcial, tweetAtual) => {
        const isLikedTweet = idDoTweetLikeado === tweetAtual._id;
        if (isLikedTweet) {
          const { likeado, totalLikes } = tweetAtual;
          const updatedTweet = {
            ...tweetAtual,
            totalLikes: likeado ? totalLikes - 1 : totalLikes + 1,
            likeado: !likeado
          };
          stateParcial.data = [...stateParcial.data, updatedTweet];
          stateParcial.activeDataItem = Object.keys(stateParcial.activeDataItem)
            .length
            ? updatedTweet
            : stateParcial.activeDataItem;
        } else {
          stateParcial.data = [...stateParcial.data, tweetAtual];
        }
        return stateParcial;
      },
      {
        activeDataItem: state.activeDataItem,
        data: []
      }
    );
    return {
      ...state,
      ...stateParcial
    };
  }

  return state;
}
