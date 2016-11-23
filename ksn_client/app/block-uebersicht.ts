import {Component, Output, EventEmitter} from "@angular/core";
import {SubjectGradeList} from "./Data/SubjectGradeList";
import {NotenLoaderService} from "./noten-loader";
/**
 * Created by maximilian.koeller on 16.11.2016.
 */
@Component({
    selector: "ksn-grades",
    templateUrl: "../templates/block-uebersicht.html",
    moduleId: module.id,
    providers: [NotenLoaderService],
    inputs: ['fachnotenliste']
})
export class BlockUebersichtComponent {

    private _fachnotenliste: SubjectGradeList;
    @Output()
    einzelnotenliste: any;
    @Output()
    showUpload = new EventEmitter<void>();

    constructor(private gradeService: NotenLoaderService) {
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
        this.gradeService.loadBlockNoten(this._fachnotenliste).subscribe(res => this.einzelnotenliste = res);
    }
}