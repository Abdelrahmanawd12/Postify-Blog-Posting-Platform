import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { LanguageReducer } from '../Store/Language/Language.Reducer';
import { LanguageEffect } from '../Store/Language/Language.Effects';
import { loadingInterceptor } from '../interceptors/Loading.interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor])),
    provideStore({language:LanguageReducer}),
    provideEffects([LanguageEffect])]
};
