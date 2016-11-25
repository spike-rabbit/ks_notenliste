import {Component, Output, EventEmitter} from "@angular/core";
/**
 * Created by Maxi- PC on 25.11.2016.
 */

@Component({
    selector: 'ksn-fnlc',
    templateUrl: 'templates/fachnotenliste-creator.html'
})
export class FachnotelisteCreatorComponent {

    @Output()
    hideFnlc = new EventEmitter<void>();

    onSubmit() {
        this.hideFnlc.emit();
    }

    onCancel() {
        this.hideFnlc.emit();
    }
}