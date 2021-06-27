import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MultipleArticlesModel, Pager } from '../models';
import { ProfileModel } from '../models/ProfileModel';

const slice = createSlice({
  name: "profile",
  initialState: {} as ProfileModel,
  reducers: {
    refreshProfile: (state, action: PayloadAction<ProfileModel>) => ({
      ...action.payload
    }),
    profilePageLoaded: (state, action: PayloadAction<{
      pager: Pager,
      data: [ProfileModel, MultipleArticlesModel]
    }>) => ({ ...action.payload.data[0] }),
    profilePageUnloaded: () => ({})
  }
});

export default slice.reducer;
export const profileActions = slice.actions;