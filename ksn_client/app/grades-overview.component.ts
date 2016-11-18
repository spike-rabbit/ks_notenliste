import {Component, Input, OnInit} from "@angular/core";
import {SubjectGradeList} from "./Data/SubjectGradeList";
import {GradeLoaderService} from "./grades-loader.service";
/**
 * Created by maximilian.koeller on 17.11.2016.
 */
@Component({
    selector : "ksn-gradesoverview",
    templateUrl : "../gradeview.html",
    moduleId: module.id,
    providers: [GradeLoaderService]
})
export class GradesOverviewComponent implements OnInit{

    @Input()
    fachnotenliste: SubjectGradeList;

    constructor(gradeService: GradeLoaderService){}

    ngOnInit(): void {

    }
}