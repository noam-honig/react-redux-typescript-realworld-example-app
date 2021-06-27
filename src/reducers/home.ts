import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HomeState,  MultipleArticlesModel, Pager } from '../models';


const slice = createSlice({
  name: 'home',
  initialState: {} as HomeState,
  reducers: {
    homePageLoaded: (state, action: PayloadAction<{
      tab: string,
      pager: Pager,
      articles: MultipleArticlesModel,
      tags: string[]
    }>) => ({
      ...state,
      tags: action.payload.tags
    }),
    homePageUnloaded: () => ({})
  }
});
export const homeActions = slice.actions;
export default slice.reducer;