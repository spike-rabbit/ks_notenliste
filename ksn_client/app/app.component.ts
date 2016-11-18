/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import {Component, OnInit, Output} from '@angular/core';
import {MasterLoaderService} from "./master-loader.service";
import {GradeLoaderService} from "./grades-loader.service";
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
    @Output()
    zeugnisse: any[];
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
        this.masterLoader.loadZeugnisse(this.klasse, this.fach).subscribe(res => this.zeugnisse = res);
    }

    updateSubjectGradeList() {
        if (!this.block.startsWith("Zeugnis")) {
            this.gradeLoader.getSubjectGradeList(this.klasse, this.fach, this.block).subscribe(res => {
                this.subjectGradeList = res;
                this.subjectGradeList.iszeugnis = false;
                console.log(res)
            });
        }
        else {
            this.gradeLoader.getSubjectGradeList(this.klasse, this.fach, this.block.substr("Zeugnis Block ".length)).subscribe(res => {
                this.subjectGradeList = res;
                this.subjectGradeList.iszeugnis = true;
                console.log(res)
            });
        }
    }
}