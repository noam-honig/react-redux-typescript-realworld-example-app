import { store } from '../store'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';
import { createAction } from "@reduxjs/toolkit";


export const asyncStart = createAction("asyncStart");
export const asyncError = createAction<{ errors: any }>("asyncError");

export const ASYNC_START = 'ASYNC_START';
export const ASYNC_END = 'ASYNC_END';





export function runAsync<T>(onSubmitForm: ActionCreatorWithOptionalPayload<T, string>,
    promise: Promise<T>) {
    store.dispatch(asyncStart());
    promise.then(onSubmitForm, r => {
        store.dispatch(asyncError({ errors: r.response.body.errors }));
    });
}