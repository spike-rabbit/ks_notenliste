import {Component, Input, OnInit, Output} from "@angular/core";
import {SubjectGradeList} from "./Data/SubjectGradeList";
import {SingleGrades} from "./Data/SingleGrades";
import {GradeLoaderService} from "./grades-loader.service";
/**
 * Created by maximilian.koeller on 16.11.2016.
 */
@Component({
    selector: "ksn-grades",
    templateUrl: "../notenliste.html",
    moduleId: module.id,
    providers: [GradeLoaderService]
})
export class GradeComponent implements OnInit {

    @Input()
    fachnotenliste: SubjectGradeList;
    @Output()
    einzelnotenliste: any[];

    constructor(private gradeService : GradeLoaderService) {}

    ngOnInit(): void {
        this.gradeService.getSingleGradeLists(this.fachnotenliste).subscribe(res => {
            console.log(res);
            this.einzelnotenliste = res;
        });
    }
}
