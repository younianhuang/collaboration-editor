import * as actionTypes from './action-types';

interface IArticle {
  id: number;
  title: string;
  body: string;
}

type ArticleState = {
  articles: IArticle[];
};

type ArticleAction = {
  type: string;
  article?: IArticle;
};

const initialState: ArticleState = {
  articles: [
    {
      id: 1,
      title: 'post 1',
      body: 'Quisque cursus, metus vitae pharetra Nam libero tempore, cum soluta nobis est eligendi',
    },
    {
      id: 2,
      title: 'post 2',
      body: 'Harum quidem rerum facilis est et expedita distinctio quas molestias excepturi sint',
    },
  ],
};

const reducer1 = (
  state: ArticleState = initialState,
  action: ArticleAction,
): ArticleState => {
  switch (action.type) {
    // case actionTypes.ADD_ARTICLE:
    //   state.articles.push(action.article);
    //   //   const newArticle: IArticle = {
    //   //     id: Math.random(), // not really unique
    //   //     title: action.article.title,
    //   //     body: action.article.body,
    //   //   };
    //   //   return {
    //   //     ...state,
    //   //     articles: state.articles.concat(newArticle),
    //   //   };
    //   return state;
    // case actionTypes.REMOVE_ARTICLE:
    //   //   const updatedArticles: IArticle[] = state.articles.filter(
    //   //     article => article.id !== action.article.id,
    //   //   );
    //   //   return {
    //   //     ...state,
    //   //     articles: updatedArticles,
    //   //   };
    //   return state;
    default:
      return state;
  }
  return state;
};

export default reducer1;
