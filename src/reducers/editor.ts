import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ASYNC_START
} from '../constants/actionTypes';
import { EditorState, SingleArticle } from '../models';

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
    editorPageUnLoaded: (state) => ({}),
    articleSubmitted: (state) => ({
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
      })
  }
})
export const editorActions = slice.actions;

export default (state: EditorState = {}, action) => {
  switch (action.type) {

    case ASYNC_START:
      if (action.subtype === editorActions.articleSubmitted.type) {
        return { ...state, inProgress: true };
      }
      break;
  }

  return slice.reducer(state, action);
}

