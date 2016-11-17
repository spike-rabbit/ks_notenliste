/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import {Component, OnInit, Output} from '@angular/core';
import {MasterLoaderService} from "./master-loader.service";
import {GradeLoaderService} from "./grades-loader.service";
import {SingleGrades} from "./Data/SingleGrades";
import {SubjectGradeList} from "./Data/SubjectGradeList";
@Component({
    selector: 'ksn-app',
    templateUrl: '../menu.html',
    providers: [MasterLoaderService, GradeLoaderService]
})
export class AppComponent implements OnInit {
    klasse: string;
    klassen: string [];

    @Output()
    faecher: string [];
    fach: string;

    @Output()
    bloecke: string[];
    block: string;

    @Output()
    subjectGradeList: SubjectGradeList;

    showUpload: boolean = false;

    constructor(private masterLoader: MasterLoaderService, private gradeLoader: GradeLoaderService) {
    }

    ngOnInit() {
        this.masterLoader.loadClasses().subscribe(res => this.klassen = res);
    }

    updateFaecher() {
        this.masterLoader.loadFaecher(this.klasse).subscribe(res => this.faecher = res);
    }

    updateBloecke() {
        this.masterLoader.loadBloecke(this.klasse, this.fach).subscribe(res => this.bloecke = res);
    }

    updateSubjectGradeList() {
        this.gradeLoader.getSubjectGradeList(this.klasse, this.fach, this.block).subscribe(res => {
            this.subjectGradeList = res;
            console.log(res)
        });
    }
}