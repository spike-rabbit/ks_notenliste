/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import {Component, OnInit, Output} from '@angular/core';
import {MasterLoaderService} from "./master-loader.service";
@Component({
    selector: 'ksn-app',
    templateUrl: '../menu.html',
    providers: [MasterLoaderService]
})
export class AppComponent implements OnInit {
    klasse: string;
    klassen: string [];
    @Output()
    faecher: string [];
    showUpload: boolean = false;

    constructor(private masterLoader: MasterLoaderService) {
    }

    ngOnInit() {
        this.masterLoader.loadClasses().subscribe(res => this.klassen = res);
    }

    updateFaecher() {
        this.masterLoader.loadFaecher(this.klasse).subscribe(res => this.faecher = res);

    }
}