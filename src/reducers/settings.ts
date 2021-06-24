import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SettingsState, SingleUser, UserModel } from '../models';
const slice = createSlice({
  name: 'settings',
  initialState: {} as SettingsState,
  reducers: {
    settingsSaved: (state, action: PayloadAction<SingleUser>) => ({
      ...state,
      inProgress: false,
      currentUser: {
        ...state.currentUser,
        inProgress: false
      }
    }),
    settingsPageUnloaded: () => ({}),
    startRequest: (state) => ({
      ...state,
      inProgress: true,
      currentUser: {
        ...state.currentUser,
        inProgress: true
      }
    }),
    error: (state, action) => {
      return ({
        ...state,
        inProgress: false,
        errors: action.payload.response.body.errors,
        currentUser: {
          ...state.currentUser,
          inProgress: false
        }
      });
    },
  }
});
export const settingsActions = slice.actions;

export default slice.reducer;