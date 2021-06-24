import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, SingleUser } from '../models';

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
    login: (state, action: PayloadAction<SingleUser>) => ({
      ...state,
      inProgress: false
    }),
    register: (state, action: PayloadAction<SingleUser>) => ({
      ...state,
      inProgress: false
    }),
    startRequest: (state) => ({
      ...state, inProgress: true
    }),
    error: (state, action) => {
      return ({
        ...state,
        inProgress: false,
        errors: action.payload.response.body.errors
      });
    },
    loginPageUnloaded: () => ({}),
    registerPageUnload: () => ({})
  }
});
export const authActions = slice.actions;
export default slice.reducer;