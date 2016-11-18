import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {SubjectGradeList} from "./Data/SubjectGradeList";
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
    @Output()
    showUpload = new EventEmitter<void>();

    constructor(private gradeService : GradeLoaderService) {}

    ngOnInit(): void {
        this.gradeService.getSingleGradeLists(this.fachnotenliste).subscribe(res => {
            console.log(res);
            this.einzelnotenliste = res;
        });
    }

    onAdd() {
        this.showUpload.emit();
    }
}
