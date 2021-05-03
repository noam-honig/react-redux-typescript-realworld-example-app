import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED
} from '../constants/actionTypes';
import { ProfileModel, SingleProfile } from '../models';

const slice = createSlice({
  name: "profile",
  initialState: {} as ProfileModel,
  reducers: {
    refreshProfile: (state, action: PayloadAction<SingleProfile>) => ({
      ...action.payload.profile
    })
  },
  extraReducers: builder => {
    builder.addCase(PROFILE_PAGE_LOADED, (state, action) => ({
      ...action.payload.data[0].profile
    }))
    builder.addCase(PROFILE_PAGE_UNLOADED, () => ({}))
  }
});

export default slice.reducer;
export const profileActions = slice.actions;