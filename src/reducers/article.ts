import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArticleState,  SingleArticle } from '../models';
import { CommentModel } from '../models/CommentModel';


const slice = createSlice({
  name: 'article',
  initialState: {} as ArticleState,
  reducers: {
    articlePageLoaded: (state, action: PayloadAction<[SingleArticle, CommentModel[]]>) =>
    ({
      ...state,
      article: action.payload[0].article,
      comments: action.payload[1]
    }),
    addComment: (state, action: PayloadAction<CommentModel>) => ({
      ...state,
      commentErrors: null,
      comments:  (state.comments || []).concat([action.payload])
    }),
    articlePageUnLoaded: () => ({}),
    deleteComment: (state, action: PayloadAction<number>) => ({
      ...state,
      comments: state.comments.filter(comment => comment.id !== action.payload)
    })
  }
});
export const articleActions = slice.actions;
export default slice.reducer;