import { store } from '../store'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';
import { createAction } from "@reduxjs/toolkit";
import { ErrorInfo } from 'remult'

export const asyncStart = createAction("asyncStart");
export const asyncError = createAction<{ errors: any }>("asyncError");

export const ASYNC_START = 'ASYNC_START';
export const ASYNC_END = 'ASYNC_END';






export function runAsync<T>(
    promise: Promise<T>,onSubmitForm: (payload: T) => void) {
    store.dispatch(asyncStart());
    promise.then(onSubmitForm, (r: ErrorInfo) => {
        {
            let errors = {};
            if (r.modelState)
                errors = r.modelState;
            else errors = {
                "": r.message
            }
            store.dispatch(asyncError({ errors }));
        }
    });
}