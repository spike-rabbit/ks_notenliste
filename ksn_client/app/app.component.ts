/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import {Component, OnInit, Output} from "@angular/core";
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
    klassen: string [] = [];

    @Output()
    faecher: string [] = [];
    fach: string;

    @Output()
    bloecke: number[] = [];
    @Output()
    zeugnisse: number[];
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
        if (this.klassen.includes(this.klasse))
            this.masterLoader.loadFaecher(this.klasse).subscribe(res => this.faecher = res);
    }

    updateBloecke() {
        if (this.faecher.includes(this.fach)) {
            this.masterLoader.loadBloecke(this.klasse, this.fach).subscribe(res => this.bloecke = res);
            this.masterLoader.loadZeugnisse(this.klasse, this.fach).subscribe(res => this.zeugnisse = res);
        }
    }

    updateSubjectGradeList(newValue: any) {
        if (!this.block.startsWith("Zeugnis Block ") && this.bloecke.includes(parseInt(this.block))) {
            this.gradeLoader.getSubjectGradeList(this.klasse, this.fach, this.block).subscribe(res => {
                this.subjectGradeList = res;
                this.subjectGradeList.iszeugnis = false;
            });
        }
        else if (this.bloecke.includes(parseInt(this.block.substr("Zeugnis Block ".length)))) {
            this.gradeLoader.getSubjectGradeList(this.klasse, this.fach, this.block.substr("Zeugnis Block ".length)).subscribe(res => {
                this.subjectGradeList = res;
                this.subjectGradeList.iszeugnis = true;
            });
        }
    }

    showUploadPopup() {
        this.showUpload = true;
    }

    hideUploadPopup() {
        this.showUpload = false;
    }
}