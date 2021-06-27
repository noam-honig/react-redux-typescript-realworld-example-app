import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { asyncError, asyncStart } from '../constants/actionTypes';
import { AuthState } from '../models';
import { UserModel } from '../models/UserModel';

const slice = createSlice({
  name: 'auth',
  initialState: {} as AuthState,
  reducers: {
    updateField: (state, action: PayloadAction<{
      key: string,
      value: string
    }>) => ({
      ...state, [action.payload.key]: action.payload.value
    }),
    login: (state, action: PayloadAction<[UserModel,string]>) => ({
      ...state,
      inProgress: false
    }),
    register: (state, action: PayloadAction<[UserModel,string]>) => ({
      ...state,
      inProgress: false
    }),
    loginPageUnloaded: () => ({}),
    registerPageUnload: () => ({})
  },
  extraReducers: reducers => {
    reducers.addCase(asyncStart, (state) => ({
      ...state, inProgress: true, errors: undefined
    }))
    reducers.addCase(asyncError, (state, action) => {
      return ({
        ...state,
        inProgress: false,
        errors: action.payload.errors
      });
    })
  }
});
export const authActions = slice.actions;
export default slice.reducer;