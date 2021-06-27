import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { asyncError, asyncStart } from '../constants/actionTypes';

import { SettingsState } from '../models';
import { UserModel } from '../models/UserModel';
const slice = createSlice({
  name: 'settings',
  initialState: {} as SettingsState,
  reducers: {
    settingsSaved: (state, action: PayloadAction<UserModel>) => ({
      ...state,
      inProgress: false,
      errors: null,
      currentUser: {
        ...state.currentUser,
        inProgress: false
      }
    }),
    settingsPageUnloaded: () => ({})
  },
  extraReducers: reducers => {
    reducers.addCase(asyncStart, (state) => ({
      ...state,
      inProgress: true,
      errors: undefined,
      currentUser: {
        ...state.currentUser,
        inProgress: true
      }
    }))
    reducers.addCase(asyncError, (state, action) => {
      return ({
        ...state,
        inProgress: false,
        errors: action.payload.errors,
        currentUser: {
          ...state.currentUser,
          inProgress: false
        }
      })
    })
  }
});
export const settingsActions = slice.actions;

export default slice.reducer;