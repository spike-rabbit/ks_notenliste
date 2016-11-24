import {Component, Input, OnInit, Output} from "@angular/core";
import {SubjectGradeList} from "./Data/SubjectGradeList";
import {NotenLoaderService} from "./noten-loader";
/**
 * Created by maximilian.koeller on 17.11.2016.
 */
@Component({
    selector: "ksn-gradesoverview",
    templateUrl: "../templates/zeugnis-uebersicht.html",
    inputs: ['fachnotenliste'],
    providers: [NotenLoaderService]
})
export class ZeugnisUebersichtComponent {
    get fachnotenliste(): SubjectGradeList {
        return this._fachnotenliste;
    }

    set fachnotenliste(value: SubjectGradeList) {
        this._fachnotenliste = value;
        this.gradeService.loadZeugnisNoten(this._fachnotenliste).subscribe(res => this.zeugnisliste = res);
    }

    private _fachnotenliste: SubjectGradeList;

    @Output()
    zeugnisliste: any;

    constructor(private gradeService: NotenLoaderService) {
    }

}