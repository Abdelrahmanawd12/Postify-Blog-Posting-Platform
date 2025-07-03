import { createReducer, on } from "@ngrx/store";
import { LanguageAction } from "./Language.Action";

const intialLanguage=localStorage.getItem("lang")?localStorage.getItem("lang"):"en";
export const LanguageReducer=createReducer(intialLanguage,
  on(LanguageAction,(state,action)=>action.lang)
)
