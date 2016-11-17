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
export class GradeLoaderService {
    private convertURL = "/noten/convertGrades";
    private saveGradesURL = "/noten/saveGrades";
    private getSubjectGradeListURL = "/noten/getSubjectGradeList";
    private getSingleGradeListsURL = "/noten/getSingleGradeLists";

    constructor(private http: Http) {
    }

    convertGrades(list: string, klasse: string): Observable<any> {
        return this.http.post(this.convertURL, {
            list: list,
            klasse: klasse
        }).map(this.extractData).catch(this.handleError);
    }

    saveGrades(singleGrades: SingleGrades) {
        return this.http.post(this.saveGradesURL, {
            data: singleGrades
        }).map(this.extractData).catch(this.handleError);
    }

    getSubjectGradeList(klasse: string, fach: string, block: string) : Observable<SubjectGradeList> {
        let params = new URLSearchParams();
        params.set("klasse", klasse);
        params.set("fach", fach);
        params.set("block", block);
        return (<Observable<SubjectGradeList>> this.http.get(this.getSubjectGradeListURL, {search: params})
            .map(this.extractData).catch(this.handleError));
    }

    getSingleGradeLists(subjectGradeList: SubjectGradeList) : Observable<NoteListenZeile[]> {
        let params = new URLSearchParams();
        params.set("fachnotenlisteID", subjectGradeList.fachnotenlisteID.toString());
        params.set("klasse", subjectGradeList.klasse);
        return (<Observable<NoteListenZeile[]>> this.http.get(this.getSingleGradeListsURL, {search: params})
            .map(this.extractData).catch(this.handleError));
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