import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, SingleArticle } from '../models';
import { asyncError, asyncStart } from '../constants/actionTypes';

const slice = createSlice({
  name: 'editor',
  initialState: { tagList: [] } as EditorState,
  reducers: {
    editorPageLoaded: (state, action: PayloadAction<SingleArticle>) =>
    ({
      ...state,
      articleSlug: action.payload ? action.payload.article.slug : '',
      title: action.payload ? action.payload.article.title : '',
      description: action.payload ? action.payload.article.description : '',
      body: action.payload ? action.payload.article.body : '',
      tagInput: '',
      tagList: action.payload ? action.payload.article.tagList : []
    })
    ,
    editorPageUnLoaded: () => ({}),
    articleSubmitted: (state, action: PayloadAction<SingleArticle>) => ({
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
