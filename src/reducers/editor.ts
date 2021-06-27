import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState } from '../models';
import { asyncError, asyncStart } from '../constants/actionTypes';
import { ArticleModel } from '../models/ArticleModel';
import { context } from '../agent';

const slice = createSlice({
  name: 'editor',
  initialState: { tagList: [] } as EditorState,
  reducers: {
    editorPageLoaded: (state, action: PayloadAction<ArticleModel>) =>
    ({
      ...state,
      article: action.payload ? action.payload : context.for(ArticleModel).create(),
      articleSlug: action.payload ? action.payload.slug : '',
      title: action.payload ? action.payload.title : '',
      description: action.payload ? action.payload.description : '',
      body: action.payload ? action.payload.body : '',
      tagInput: '',
      tagList: action.payload ? action.payload.tagList : []
    }),

    articleSubmitted: (state, action: PayloadAction<ArticleModel>) => ({
      ...state,
      inProgress: null
    }),
    addTag: (state) => ({
      ...state,
      tagList: state.tagList.concat([state.tagInput]),
      tagInput: ''
    }),
    removeTag: (state, action: PayloadAction<string>) => ({
      ...state,
      tagList: state.tagList.filter(tag => tag !== action.payload)
    }),
    updateFieldEditor: (state, action: PayloadAction<{ key: string, value: string }>) => (
      {
        ...state, [action.payload.key]: action.payload.value
      }),
    editorPageUnLoaded: () => ({})
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
})
export const editorActions = slice.actions;
export default slice.reducer;
