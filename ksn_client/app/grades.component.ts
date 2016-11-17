import {Component, Input} from "@angular/core";
/**
 * Created by maximilian.koeller on 16.11.2016.
 */
@Component({
    selector : "ksn-grades",
    templateUrl : "../notenliste.html"
    })
export class GradeComponent {
    @Input()
    klasse : string;
}