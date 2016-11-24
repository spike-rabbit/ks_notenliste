/**
 * Created by maximilian.koeller on 15.11.2016.
 */
import {Component, Input, Output, EventEmitter, AfterViewInit} from "@angular/core";
import {GradeType} from "./Data/GradeType";
import {NotenLoaderService} from "./noten-loader";
import "./rxjs-operators";
import {SingleGrades} from "./Data/SingleGrades";
import {DatePipe} from "@angular/common";

declare var jQuery:any;

@Component({
    selector: 'ksn-upload',
    templateUrl: '../templates/upload.html',
    providers: [NotenLoaderService],
    inputs: ['klasse'],
})
export class UploadComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        jQuery('#uploadDate').datepicker({
            format: "dd.mm.yyyy",
            autoclose: true,
            language: "de"
        });
    }


    constructor(private uploadService: NotenLoaderService) {
    }

    gradeType: GradeType;
    klasse: string;
    gewichtung: number;
    datum = new DatePipe("en").transform(Date.now(), "dd.MM.yyyy");
    parsedListe: EinzelNote[] = [];
    notenlisteOkStatus = false;
    @Input()
    fachnotenListeID: number;
    @Output()
    hideUpload = new EventEmitter<boolean>();

    public convertGradeList(list: string) {
        list.replace(',', '.');
        this.uploadService.convertNoten(list, this.klasse).subscribe(res => {
            this.parsedListe = res.body;
            this.notenlisteOkStatus = res.notenlisteOkStatus;
        });
    }

    public saveGradeList() {
        let singleGrade: SingleGrades = {
            fachNotenListe: this.fachnotenListeID,
            typ: this.gradeType,
            gewichtung: this.gewichtung,
            noten: this.parsedListe,
            lehrer: "BOE",
            datum: "2016-03-01"
        };
        this.uploadService.saveNoten(singleGrade).subscribe(res => {
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
    missing: boolean;
}
