/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import {Component, OnInit, Output} from "@angular/core";
import {StammdatenLoaderService} from "./stammdaten-loader.service";
import {NotenLoaderService} from "./noten-loader";
import {SubjectGradeList} from "./Data/SubjectGradeList";
@Component({
    selector: 'ksn-app',
    templateUrl: '../templates/app.html',
    providers: [StammdatenLoaderService, NotenLoaderService]
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
    reload = 0;

    @Output()
    subjectGradeList: SubjectGradeList;

    showUpload: boolean = false;

    constructor(private masterLoader: StammdatenLoaderService, private gradeLoader: NotenLoaderService) {
    }

    ngOnInit() {
        this.masterLoader.loadClasses().subscribe(res => this.klassen = res);
    }

    updateFaecher() {
        if (this.klassen.indexOf(this.klasse) >= 0)
            this.masterLoader.loadFaecher(this.klasse).subscribe(res => this.faecher = res);
        else
        {
            this.fach = undefined;
            this.faecher = [];
        }
    }

    updateBloecke() {
        if (this.faecher.indexOf(this.fach) >= 0) {
            this.masterLoader.loadBloecke(this.klasse, this.fach).subscribe(res => this.bloecke = res);
            this.masterLoader.loadZeugnisse(this.klasse, this.fach).subscribe(res => this.zeugnisse = res);
        }
        else {
            this.bloecke = [];
            this.zeugnisse = [];
            this.block = undefined;
        }

    }

    updateSubjectGradeList() {
        if (this.block.search("Zeugnis Block *") == -1 && this.bloecke.indexOf(parseInt(this.block)) >= 0) {
            this.gradeLoader.getFachnotenliste(this.klasse, this.fach, this.block).subscribe(res => {
                this.subjectGradeList = res;
                this.subjectGradeList.iszeugnis = false;
            });
        }
        else if (this.zeugnisse.indexOf(parseInt(this.block.substr("Zeugnis Block ".length))) >= 0) {
            this.gradeLoader.getFachnotenliste(this.klasse, this.fach, this.block.substr("Zeugnis Block ".length)).subscribe(res => {
                this.subjectGradeList = res;
                this.subjectGradeList.iszeugnis = true;
            });
        } else {
            this.subjectGradeList = undefined;
        }

        return false;
    }


    showUploadPopup() {
        this.showUpload = true;
    }

    hideUploadPopup(reload: boolean) {
        this.showUpload = false;
        if (reload)
            this.updateSubjectGradeList();
    }
}