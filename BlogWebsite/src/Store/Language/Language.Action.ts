import { createAction, props } from "@ngrx/store";

export const LanguageAction =createAction("language",props<{lang:string}>())
