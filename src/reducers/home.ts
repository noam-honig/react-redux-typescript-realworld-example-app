import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HomeState, ListOfTags, MultipleArticlesModel, Pager } from '../models';


const slice = createSlice({
  name: 'home',
  initialState: {} as HomeState,
  reducers: {
    homePageLoaded: (state, action: PayloadAction<{
      tab: string,
      pager: Pager,
      articles: MultipleArticlesModel,
      tags: ListOfTags
    }>) => ({
      ...state,
      tags: action.payload.tags.tags
    }),
    homePageUnloaded: () => ({})
  }
});
export const homeActions = slice.actions;
export default slice.reducer;