import { createSlice } from '@reduxjs/toolkit';
import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED } from '../constants/actionTypes';
import { HomeState } from '../models';


const slice = createSlice({
  name: 'home',
  initialState: {} as HomeState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(HOME_PAGE_LOADED, (state, action) => ({
      ...state,
      tags: action.payload.tags.tags
    }));
    builder.addCase(HOME_PAGE_UNLOADED, () => ({}));
  }
});

export default slice.reducer;