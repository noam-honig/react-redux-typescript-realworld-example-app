import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArticleState, MultipleComments, SingleArticle, SingleComment } from '../models';


const slice = createSlice({
  name: 'article',
  initialState: {} as ArticleState,
  reducers: {
    articlePageLoaded: (state, action: PayloadAction<[SingleArticle, MultipleComments]>) =>
    ({
      ...state,
      article: action.payload[0].article,
      comments: action.payload[1].comments
    }),
    addComment: (state, action: PayloadAction<SingleComment & { errors? }> & { error? }) => ({
      ...state,
      commentErrors: action.error ? action.payload.errors : null,
      comments: action.error ? null : (state.comments || []).concat([action.payload.comment])
    }),
    articlePageUnLoaded: () => ({}),
    deleteComment: (state, action: PayloadAction<number>) => ({
      ...state,
      comments: state.comments.filter(comment => comment.id !== action.payload)
    })
  }
});
export const {
  articlePageLoaded,
  articlePageUnLoaded,
  deleteComment,
  addComment } = slice.actions;
export default slice.reducer;