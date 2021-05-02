import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArticleState, MultipleComments, SingleArticle } from '../models';


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
    articlePageUnLoaded: () => ({}),
    deleteComment: (state, action: PayloadAction<number>) => ({
      ...state,
      comments: state.comments.filter(comment => comment.id !== action.payload)
    })
  }
});
export const { articlePageLoaded, articlePageUnLoaded, deleteComment } = slice.actions;
export default slice.reducer;