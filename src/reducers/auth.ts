import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { string } from 'prop-types';
import {
  LOGIN,
  REGISTER,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ASYNC_START,
  UPDATE_FIELD_AUTH
} from '../constants/actionTypes';
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
    error: (state, action) => {
      return ({
        ...state,
        inProgress: false,
        errors: action.payload.response.body.errors
      });
    }


  }
});
export const authActions = slice.actions;
export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      };
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return {};
    case ASYNC_START:
      if (action.subtype === LOGIN || action.subtype === REGISTER) {
        return { ...state, inProgress: true };
      }
      break;
    case UPDATE_FIELD_AUTH:
      return { ...state, [action.key]: action.value };
    default:
      return slice.reducer(state, action);
  }

  return state;
};
