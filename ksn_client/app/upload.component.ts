/**
 * Created by maximilian.koeller on 15.11.2016.
 */
import {Component, Input} from '@angular/core';
import {GradeType} from "./Data/GradeType";
import {UploadService} from "./upload.service";
import './rxjs-operators';

@Component({
    selector: 'ksn-upload',
    templateUrl: '../gradeUpload.html',
    moduleId: module.id,
    providers: [UploadService],
    inputs: ['klasse'],
    outputs: ['parsedList']
})
export class UploadComponent {
    constructor(private uploadService: UploadService) {
    }

    type: GradeType;
    klasse: string;
    parsedList: EinzelNote[];

    public convertGradeList(list: string) {
        this.uploadService.convertGrades(list, this.klasse).subscribe(res => this.parsedList = (<EinzelNote []> res));
    }
}

interface EinzelNote {
    vorname: string;
    nachname: string;
    id: number;
    note: number;
}
