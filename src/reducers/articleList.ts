import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ArticleListState, MultipleArticlesModel, Pager, SingleArticle } from '../models';
import { homeActions } from './home';
import { profileActions } from './profile';




const slice = createSlice({
  name: 'articleList',
  initialState: {} as ArticleListState,
  reducers: {
    applyTagFilter: (state, action: PayloadAction<{
      tag: string,
      pager: Pager,
      articles: MultipleArticlesModel
    }>) => (
      {
        ...state,
        pager: action.payload.pager,
        articles: action.payload.articles.articles,
        articlesCount: action.payload.articles.articlesCount,
        tab: null,
        tag: action.payload.tag,
        currentPage: 0
      }),
    refreshArticleFavorited: (state, action: PayloadAction<SingleArticle>) => ({
      ...state,
      articles: state.articles.map(article => {
        if (article.slug === action.payload.article.slug) {
          return {
            ...article,
            favorited: action.payload.article.favorited,
            favoritesCount: action.payload.article.favoritesCount
          };
        }
        return article;
      })
    }),
    setPage: (state, action: PayloadAction<{ articles: MultipleArticlesModel, page: number }>) =>
    ({
      ...state,
      articles: action.payload.articles.articles,
      articlesCount: action.payload.articles.articlesCount,
      currentPage: action.payload.page
    }),
    changeTab: (state, action: PayloadAction<{
      pager: Pager,
      articles: MultipleArticlesModel,
      tab: string
    }>) => ({
      ...state,
      pager: action.payload.pager,
      articles: action.payload.articles.articles,
      articlesCount: action.payload.articles.articlesCount,
      tab: action.payload.tab,
      currentPage: 0,
      tag: null
    })
    
  }
  ,
  extraReducers: builder => {
    builder.addCase(homeActions.homePageLoaded, (state, action) => ({
      ...state,
      pager: action.payload.pager,
      tags: action.payload.tags.tags,
      articles: action.payload.articles.articles,
      articlesCount: action.payload.articles.articlesCount,
      currentPage: 0,
      tab: action.payload.tab
    }));
    builder.addCase(homeActions.homePageUnloaded, () => ({}))
    builder.addCase(profileActions.profilePageLoaded, (state, action) => ({
      ...state,
      pager: action.payload.pager,
      articles: action.payload.data[1].articles,
      articlesCount: action.payload.data[1].articlesCount,
      currentPage: 0
    }));
    builder.addCase(profileActions.profilePageUnloaded, (state) => ({}));

  }
});
export const articleListActions = slice.actions;
export default slice.reducer;