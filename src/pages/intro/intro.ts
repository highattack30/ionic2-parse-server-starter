import {Component} from '@angular/core';
import {MenuController, NavController, ModalController} from 'ionic-angular';
import {AnalyticsProvider} from "../../providers/analytics";

export interface Slide {
    title: string;
    image: string;
}

@Component({
    selector   : 'page-intro',
    templateUrl: 'intro.html'
})

export class IntroPage {
    slides: Slide[];
    showSkip = true;
    device   = 'android';

    constructor(public navCtrl: NavController,
                public menu: MenuController,
                public modalCtrl: ModalController,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('IntroPage');

        this.slides = [
            {
                title: 'Share more incredible moments',
                image: 'assets/img/intro1.png',
            },
            {
                title: 'Follow your friends and relive your moments',
                image: 'assets/img/intro2.png',
            },
        ];
    }

    modalLanguage(): void {
//        this.modalCtrl.create(LanguageModalComponent).present();
    }

    startApp(): void {
//        this.navCtrl.push(AuthPage);
    }

    onSlideChangeStart(slider) {
        this.showSkip = !slider.isEnd;
    }

}
