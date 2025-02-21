import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import agent from '../agent';
import { CommonState, SingleUser } from '../models';
import { articleActions } from './article';

import { authActions } from './auth';
import { editorActions } from './editor';
import { homeActions } from './home';
import { profileActions } from './profile';
import { settingsActions } from './settings';



const slice = createSlice({
  name: 'common',
  initialState: {
    appName: 'Conduit',
    token: null,
    viewChangeCounter: 0
  } as CommonState,
  reducers: {
    deleteArticle: (state) => ({
      ...state,
      redirectTo: '/'
    }),
    appLoad: (state, action: PayloadAction<{
      token: string,
      user: SingleUser
    }>) => ({
      ...state,
      token: action.payload.token || null,
      appLoaded: true,
      currentUser: action.payload.user ? action.payload.user.user : null
    }),
    redirect: (state) => ({
      ...state,
      redirectTo: null
    }),
    logout: (state) => {
      window.localStorage.setItem('jwt', '');
      agent.setToken(null);
      return ({
        ...state, redirectTo: '/', token: null, currentUser: null
      })
    }
  },
  extraReducers: add => {
    add.addCase(editorActions.articleSubmitted, (state, action) => {
      const redirectUrl = `/article/${action.payload.article.slug}`;
      return { ...state, redirectTo: redirectUrl };
    });
    add.addCase(settingsActions.settingsSaved, (state, action) => ({
      ...state,
      redirectTo: '/',
      currentUser: action.payload.user
    }));
    for (const action of [authActions.login, authActions.register]) {
      add.addCase(action, (state, action) => {
        window.localStorage.setItem('jwt', action.payload.user.token);
        agent.setToken(action.payload.user.token);
        return ({
          ...state,
          redirectTo: '/',
          token: action.payload.user.token,
          currentUser: action.payload.user
        })
      })
    }
    for (const action of [
      articleActions.articlePageUnLoaded
      , editorActions.editorPageUnLoaded
      , homeActions.homePageUnloaded
      , profileActions.profilePageUnloaded
      , settingsActions.settingsPageUnloaded
      , authActions.loginPageUnloaded
      , authActions.registerPageUnload
    ]) {
      add.addCase(action, (state) => ({
        ...state, viewChangeCounter: state.viewChangeCounter + 1
      }))
    }
  }
});
export default slice.reducer;
export const commonActions = slice.actions;

