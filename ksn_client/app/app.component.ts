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
        if (this.klassen.includes(this.klasse))
            this.masterLoader.loadFaecher(this.klasse).subscribe(res => this.faecher = res);
    }

    updateBloecke() {
        if (this.faecher.includes(this.fach)) {
            this.masterLoader.loadBloecke(this.klasse, this.fach).subscribe(res => this.bloecke = res);
            this.masterLoader.loadZeugnisse(this.klasse, this.fach).subscribe(res => this.zeugnisse = res);
        }
    }

    updateSubjectGradeList() {
        if (!this.block.startsWith("Zeugnis Block ") && this.bloecke.includes(parseInt(this.block))) {
            this.gradeLoader.getFachnotenliste(this.klasse, this.fach, this.block).subscribe(res => {
                this.subjectGradeList = res;
                this.subjectGradeList.iszeugnis = false;
            });
        }
        else if (this.bloecke.includes(parseInt(this.block.substr("Zeugnis Block ".length)))) {
            this.gradeLoader.getFachnotenliste(this.klasse, this.fach, this.block.substr("Zeugnis Block ".length)).subscribe(res => {
                this.subjectGradeList = res;
                this.subjectGradeList.iszeugnis = true;
            });
        }
    }

    isBlockValid() {
        return !this.block.startsWith("Zeugnis Block ") && this.bloecke.includes(parseInt(this.block)) ||
            this.zeugnisse.includes(parseInt(this.block.substr("Zeugnis Block ".length)));
    }

    showUploadPopup() {
        this.showUpload = true;
    }

    hideUploadPopup(reload : boolean) {
        this.showUpload = false;
        if(reload)
        this.updateSubjectGradeList();
    }
}