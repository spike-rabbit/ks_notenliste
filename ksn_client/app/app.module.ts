/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}   from './app.component';
import {UploadComponent} from "./upload.component";
import {FormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {GradeComponent} from "./grades.component";
import {GradesOverviewComponent} from "./grades-overview.component";
@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, JsonpModule],
    declarations: [AppComponent, UploadComponent, GradeComponent, GradesOverviewComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
