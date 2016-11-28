import {Component, Output, EventEmitter, OnInit} from "@angular/core";
import {StammdatenLoaderService} from "./stammdaten-loader.service";
import {NotenLoaderService} from "./noten-loader.service";
/**
 * Created by Maxi- PC on 25.11.2016.
 */

@Component({
    selector: 'ksn-fnlc',
    templateUrl: 'templates/fachnotenliste-creator.html',
    providers: [StammdatenLoaderService, NotenLoaderService]
})
export class FachnotelisteCreatorComponent implements OnInit {

    @Output()
    hideFnlc = new EventEmitter<void>();

    private unterrichtsfaecher = [];
    private klassen = [];
    private lehrers = [];

    private unterrichtsfach: string;
    private klasse: string;
    private block: number;
    private stundenzahl: number;
    private lehrer: string;
    private isZeugnis: boolean;


    constructor(private stammdatenService: StammdatenLoaderService, private notenService: NotenLoaderService) {
    }

    ngOnInit(): void {
        this.stammdatenService.loadAllFaecher().subscribe(val => this.unterrichtsfaecher = val);
        this.stammdatenService.loadClasses().subscribe(val => this.klassen = val);
        this.stammdatenService.loadLehrer().subscribe(val => this.lehrers = val);
    }

    onSubmit() {
        this.notenService.saveFachnotenlist({
            unterrichtsfach: this.unterrichtsfach,
            klasse: this.klasse,
            block: this.block,
            stundenzahl: this.stundenzahl,
            lehrer: this.lehrer,
            isZeugnis: this.isZeugnis
        }).subscribe(val => {
            console.log(val);
            this.hideFnlc.emit();
        });
    }

    onCancel() {
        this.hideFnlc.emit();
    }
}