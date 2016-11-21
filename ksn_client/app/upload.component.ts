/**
 * Created by maximilian.koeller on 15.11.2016.
 */
import {Component, Input, Output, EventEmitter, AfterViewInit} from "@angular/core";
import {GradeType} from "./Data/GradeType";
import {GradeLoaderService} from "./grades-loader.service";
import "./rxjs-operators";
import {SingleGrades} from "./Data/SingleGrades";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'ksn-upload',
    templateUrl: '../gradeUpload.html',
    moduleId: module.id,
    providers: [GradeLoaderService],
    inputs: ['klasse'],
})
export class UploadComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        (<any>$('#uploadDate')).datepicker({
            format: "dd.mm.yyyy",
            autoclose: true,
            language: "de"
        });
    }


    constructor(private uploadService: GradeLoaderService) {
    }

    gradeType: GradeType;
    klasse: string;
    gewichtung: number;
    datum = new DatePipe("en").transform(Date.now(), "dd.MM.yyyy");
    @Output()
    accepted: EinzelNote[] = [];
    @Output()
    notFound: EinzelNote[] = [];
    @Output()
    notenlisteOkStatus = false;
    @Input()
    fachnotenListeID: number;
    @Output()
    hideUpload = new EventEmitter<boolean>();

    public convertGradeList(list: string) {
        list.replace(',', '.');
        this.uploadService.convertGrades(list, this.klasse).subscribe(res => {
            this.accepted = res.accepted;
            this.notFound = res.notFound;
            this.notenlisteOkStatus = res.notenlisteOkStatus;
        });
    }

    public saveGradeList() {
        let singleGrade: SingleGrades = {
            fachNotenListe: this.fachnotenListeID,
            typ: this.gradeType,
            gewichtung: this.gewichtung,
            noten: this.accepted,
            lehrer: "BOE",
            datum: "2016-03-01"
        };
        this.uploadService.saveGrades(singleGrade).subscribe(res => {
            this.hideUpload.emit(true);
        });
    }

    onCancel() {
        this.hideUpload.emit(false);
    }

}

interface EinzelNote {
    vorname: string;
    nachname: string;
    id: number;
    note: number;
}
