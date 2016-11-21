import {Component, Output, EventEmitter} from "@angular/core";
import {SubjectGradeList} from "./Data/SubjectGradeList";
import {GradeLoaderService} from "./grades-loader.service";
/**
 * Created by maximilian.koeller on 16.11.2016.
 */
@Component({
    selector: "ksn-grades",
    templateUrl: "../notenliste.html",
    moduleId: module.id,
    providers: [GradeLoaderService],
    inputs: ['fachnotenliste']
})
export class GradeComponent {

    private _fachnotenliste: SubjectGradeList;
    @Output()
    einzelnotenliste: any;
    @Output()
    showUpload = new EventEmitter<void>();

    constructor(private gradeService: GradeLoaderService) {
    }


    onAdd() {
        this.showUpload.emit();
    }

    onDelete(einzelnotenliste) {
        this.gradeService.deleteEinzelnotenliste(einzelnotenliste.einzelnotenlisteID).subscribe((res) => {
            if (res) {
                console.log(this.einzelnotenliste);
                let index = this.einzelnotenliste.header.lastIndexOf(einzelnotenliste);
                this.einzelnotenliste.header.splice(index, 1);
                for (let schueler of this.einzelnotenliste.einzelnoten) {
                    schueler.noten.splice(index, 1);
                }
            }
            this.gradeService.berechneVorschlaege(this.einzelnotenliste);
        });
    }

    get fachnotenliste(): SubjectGradeList {
        return this._fachnotenliste;
    }

    set fachnotenliste(value: SubjectGradeList) {
        this._fachnotenliste = value;
        this.gradeService.getSingleGradeLists(this._fachnotenliste).subscribe(res => this.einzelnotenliste = res);
    }
}
