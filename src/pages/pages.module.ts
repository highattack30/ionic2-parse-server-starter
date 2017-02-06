import {Config, IonicModule, Platform} from 'ionic-angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Http} from '@angular/http';
// External Libs

import {MomentModule} from 'angular2-moment';
import {TranslateStaticLoader, TranslateModule, TranslateLoader, TranslateService} from 'ng2-translate';
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './i18n', '.json');
}

declare var window: any;
import _ from 'underscore';
// Config
import {language_default, languages} from '../config';
// Pipes
import {PipesModule} from '../pipes/pipes.module';
// Providers
import {ProvidersModule} from '../providers/providers.module';
// Pages
import {TabsPage} from '../pages/tabs/tabs';
import {IntroPage} from '../pages/intro/intro';
import {AboutPage} from './about/about';
import {HomePage} from './home/home';

export const APP_PAGES = [
  IntroPage,
  TabsPage,
  AboutPage,
  HomePage,

];

@NgModule({
  imports:      [
    CommonModule,
    PipesModule,
    ProvidersModule,
    MomentModule,
    TranslateModule.forRoot({
      provide   : TranslateLoader,
      useFactory: (createTranslateLoader),
      deps      : [Http]
    }),
    IonicModule.forRoot(TabsPage),
    IonicModule.forRoot(IntroPage),
  ],
  exports:      [
    APP_PAGES,
    MomentModule,
  ],
  declarations: [
    APP_PAGES,
  ],
  providers:    []
})
export class PagesModule {

  constructor(private config: Config,
              private translate: TranslateService,
              private platform: Platform,) {
    this.translateConfig();

  }

  translateConfig() {
    // use navigator lang if available
    let userLang = navigator.language.indexOf('-') ? navigator.language.split('-')[0] : navigator.language;
    let language = _.find(languages, {code: userLang}) ? _.find(languages, {code: userLang}).code : language_default;

    console.log('language', userLang, language);

    this.translate.addLangs(languages.map(lang => lang.code));

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(language_default);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(language);

    // set lang back button
    //this.translate.get('backButtonText').subscribe((res: string) => this.config.set('Back', res));
    this.config.set('backButtonText', '');

  }

}
