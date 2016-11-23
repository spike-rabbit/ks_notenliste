import {Injectable} from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {SingleGrades} from "./Data/SingleGrades";
import {SubjectGradeList} from "./Data/SubjectGradeList";
import {NoteListenZeile} from "./Data/NoteListenZeile";
/**
 * Created by maximilian.koeller on 15.11.2016.
 */
@Injectable()
export class NotenLoaderService {
    private convertNotenURL = "/noten/convertNoten";
    private saveNotenURL = "/noten/saveNoten";
    private getFachnotenlisteURL = "/noten/getFachnotenliste";
    private getBlockNotenURL = "/noten/loadBlockNoten";
    private loadZeugnisURL = "/noten/loadZeugnisNoten";
    private deleteEinzelnotenlisteURL = "/noten/deleteEinzelnotenliste"

    constructor(private http: Http) {
    }

    convertNoten(list: string, klasse: string): Observable<any> {
        return this.http.post(this.convertNotenURL, {
            list: list,
            klasse: klasse
        }).map(this.extractData).catch(this.handleError);
    }

    saveNoten(singleGrades: SingleGrades) {
        return this.http.post(this.saveNotenURL, {
            data: singleGrades
        }).map(this.extractData).catch(this.handleError);
    }

    getFachnotenliste(klasse: string, fach: string, block: string): Observable<SubjectGradeList> {
        let params = new URLSearchParams();
        params.set("klasse", klasse);
        params.set("fach", fach);
        params.set("block", block);
        return (<Observable<SubjectGradeList>> this.http.get(this.getFachnotenlisteURL, {search: params})
            .map(this.extractData).catch(this.handleError));
    }

    loadBlockNoten(subjectGradeList: SubjectGradeList): Observable<NoteListenZeile[]> {
        let params = new URLSearchParams();
        params.set("fachnotenlisteID", subjectGradeList.fachnotenlisteID.toString());
        params.set("klasse", subjectGradeList.klasse);
        return (<Observable<NoteListenZeile[]>> this.http.get(this.getBlockNotenURL, {search: params})
            .map(this.extractData).map(this.berechneVorschlaege).catch(this.handleError));
    }

    berechneVorschlaege(liste:any) {
        if (liste.header.length > 0) {
            let gesamtGewicht = liste.header.map((value:any) => value.gewichtung).reduce((prev:number, curr:number) => prev + curr);
            for (let schueler of liste.einzelnoten) {
                let summe = 0;
                let abzugsGewicht = 0;
                for (let index in schueler.noten) {
                    if (schueler.noten[index] != -1) {
                        summe += schueler.noten[index] * liste.header[index].gewichtung;
                    } else {
                        abzugsGewicht += liste.header[index].gewichtung;
                    }
                }
                schueler.vorschlag = summe / (gesamtGewicht - abzugsGewicht);
            }
        }
        return liste;
    }

    loadZeugnisNoten(subjectGradeList: SubjectGradeList) {
        let params = new URLSearchParams();
        params.set("block", subjectGradeList.block.toString());
        params.set("klasse", subjectGradeList.klasse);
        params.set("fach", subjectGradeList.unterrichtsfach);
        return (<Observable<any>> this.http.get(this.loadZeugnisURL, {search: params})
            .map(this.extractData).map(liste => {

                let subheaderIndex = 0;
                let subheaderIndex2 = 0;
                let bearbeiteterBereich = 0;
                for (let header of liste.header) {
                    let subheaderSum = 0;
                    while (subheaderIndex < header.listencount + bearbeiteterBereich) {
                        subheaderSum += liste.subheader[subheaderIndex].gewichtung;
                        subheaderIndex++;
                    }
                    while (subheaderIndex2 < header.listencount + bearbeiteterBereich) {
                        liste.subheader[subheaderIndex2].interneGewichtung = header.stundenzahl * (liste.subheader[subheaderIndex2].gewichtung / subheaderSum);
                        subheaderIndex2++;
                    }
                    bearbeiteterBereich += header.listencount;
                }
                if (liste.subheader.length > 0) {
                    let gesamtGewicht = liste.subheader.filter((value:any) => value).map((value:any) => value.interneGewichtung).reduce((prev:number, curr:number) => prev + curr);
                    for (let schueler of liste.body) {
                        let summe = 0;
                        let abzugsGewicht = 0;
                        for (let index in schueler.noten) {
                            if (schueler.noten[index] != -1) {
                                summe += schueler.noten[index] * liste.subheader[index].interneGewichtung;
                            } else {
                                abzugsGewicht += liste.subheader[index].interneGewichtung;
                            }
                        }
                        schueler.vorschlag = summe / (gesamtGewicht - abzugsGewicht);
                    }
                }
                return liste;
            }).catch(this.handleError));
    }

    deleteEinzelnotenliste(einzelnotenlisteID: number): Observable<boolean> {
        let params = new URLSearchParams();
        params.set("einzelnotenlisteID", einzelnotenlisteID.toString());
        return this.http.get(this.deleteEinzelnotenlisteURL, {search: params})
            .map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: Response | any) {
        //In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(error);
        return Observable.throw(errMsg);
    }
}