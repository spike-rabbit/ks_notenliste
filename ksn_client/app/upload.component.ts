/**
 * Created by maximilian.koeller on 15.11.2016.
 */
import {Component, Input, Output, OnInit} from '@angular/core';
import {GradeType} from "./Data/GradeType";
import {GradeLoaderService} from "./grades-loader.service";
import './rxjs-operators';
import {SingleGrades} from "./Data/SingleGrades";

@Component({
    selector: 'ksn-upload',
    templateUrl: '../gradeUpload.html',
    moduleId: module.id,
    providers: [GradeLoaderService],
    inputs: ['klasse'],
})
export class UploadComponent implements OnInit{

    ngOnInit(): void {
        console.log(this.fachnotenListeID);
    }
    constructor(private uploadService: GradeLoaderService) {
    }

    gradeType: GradeType;
    klasse: string;
    gewichtung: number;
    @Output()
    accepted: EinzelNote[];
    @Output()
    notFound: EinzelNote[];
    @Input()
    fachnotenListeID: number;

    public convertGradeList(list: string) {
        this.uploadService.convertGrades(list, this.klasse).subscribe(res => {
            this.accepted = res.accepted;
            this.notFound = res.notFound
        });
    }

    public saveGradeList() {
        let singleGrade: SingleGrades = {
            fachNotenListe: this.fachnotenListeID,
            typ: this.gradeType,
            gewichtung: this.gewichtung,
            noten: this.accepted.map((value, index, array)=> {
                return {
                    wert: value.note,
                    schuelerID: value.id
                }
            }),
            lehrer : "BOE",
            datum : "2016-03-01"
        };
        this.uploadService.saveGrades(singleGrade).subscribe(res => console.log(res));
    }
}

interface EinzelNote {
    vorname: string;
    nachname: string;
    id: number;
    note: number;
}
