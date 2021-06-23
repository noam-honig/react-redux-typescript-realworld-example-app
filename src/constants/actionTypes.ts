import { createAction } from "@reduxjs/toolkit";
import { string } from "prop-types";
import { ListOfTags, MultipleArticlesModel, Pager, ProfileModel, SingleProfile } from "../models";

export const APP_LOAD = 'APP_LOAD';
export const REDIRECT = 'REDIRECT';

export const SETTINGS_SAVED = 'SETTINGS_SAVED';
export const DELETE_ARTICLE = 'DELETE_ARTICLE';
export const SETTINGS_PAGE_UNLOADED = 'SETTINGS_PAGE_UNLOADED';








export const CHANGE_TAB = 'CHANGE_TAB';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const LOGIN_PAGE_UNLOADED = 'LOGIN_PAGE_UNLOADED';
export const REGISTER_PAGE_UNLOADED = 'REGISTER_PAGE_UNLOADED';
export const ASYNC_START = 'ASYNC_START';
export const ASYNC_END = 'ASYNC_END';



export const UPDATE_FIELD_AUTH = 'UPDATE_FIELD_AUTH';

export const FOLLOW_USER = 'FOLLOW_USER';
export const UNFOLLOW_USER = 'UNFOLLOW_USER';
export const PROFILE_FAVORITES_PAGE_UNLOADED = 'PROFILE_FAVORITES_PAGE_UNLOADED';
export const PROFILE_FAVORITES_PAGE_LOADED = 'PROFILE_FAVORITES_PAGE_LOADED';