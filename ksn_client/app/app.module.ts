/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}   from './app.component';
import {UploadComponent} from "./upload.component";
import {FormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {BlockUebersichtComponent} from "./block-uebersicht";
import {ZeugnisUebersichtComponent} from "./zeugnis-uebersicht.component";
@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, JsonpModule],
    declarations: [AppComponent, UploadComponent, BlockUebersichtComponent, ZeugnisUebersichtComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
