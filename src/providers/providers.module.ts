import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
// Providers
import {IonicUtilProvider} from "./ionic-util";
import {LoggingProvider} from "./logging";
import {AuthProvider} from "./auth";
import {UserProvider} from "./user";
import {ParseFileProvider} from "./parse-file";
import {ParsePushProvider} from "./parse-push";
import {ExternalLibProvider} from "./external-lib";
import {AnalyticsProvider} from "./analytics";

export const sharedProviders = [
    IonicUtilProvider,
    ExternalLibProvider,
    LoggingProvider,
    AuthProvider,
    UserProvider,
    ParseFileProvider,
    ParsePushProvider,
    AnalyticsProvider,
];

@NgModule({
    imports     : [CommonModule],
    exports     : [],
    declarations: [],
    providers   : [sharedProviders]
})
export class ProvidersModule {
}
