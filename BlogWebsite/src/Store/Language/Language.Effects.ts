import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { LanguageAction } from "./Language.Action";
import { tap } from "rxjs";

@Injectable()
export class LanguageEffect {
  saveLanguage;

  constructor(private actions$: Actions) {
    this.saveLanguage = createEffect(
      () =>
        this.actions$.pipe(
          ofType(LanguageAction),
          tap((action) => {
            localStorage.setItem("lang", action.lang);
          })
        ),
      { dispatch: false }
    );
  }
}
