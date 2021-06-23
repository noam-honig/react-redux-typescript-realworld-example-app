import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MultipleArticlesModel, Pager, ProfileModel, SingleProfile } from '../models';

const slice = createSlice({
  name: "profile",
  initialState: {} as ProfileModel,
  reducers: {
    refreshProfile: (state, action: PayloadAction<SingleProfile>) => ({
      ...action.payload.profile
    }),
    profilePageLoaded: (state, action: PayloadAction<{
      pager: Pager,
      data: [SingleProfile, MultipleArticlesModel]
    }>) => ({ ...action.payload.data[0].profile }),
    profilePageUnloaded: () => ({})
  }
});

export default slice.reducer;
export const profileActions = slice.actions;