/**
 * Created by maximilian.koeller on 15.11.2016.
 */
import {Injectable} from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
/**
 * Created by maximilian.koeller on 15.11.2016.
 */
@Injectable()
export class StammdatenLoaderService {
    private listKLassenURL = "/stammdaten/listKlassen";
    private listFaecherURL = "/stammdaten/listFaecher";
    private listBloeckeURL = "/stammdaten/listBloecke";
    private listZeugnisseURL = "/stammdaten/listZeugnisse";


    constructor(private http: Http) {
    }

    loadClasses(): Observable<string []> {
        return this.http.get(this.listKLassenURL).map(this.extractData).catch(this.handleError);
    }

    loadFaecher(klasse: string) : Observable<string[]> {
        let params = new URLSearchParams();
        params.set("klasse", klasse);
        return this.http.get(this.listFaecherURL, {search: params}).map(this.extractData).catch(this.handleError);
    }

    loadBloecke(klasse: string, fach: string) : Observable<number[]> {
        let params = new URLSearchParams();
        params.set("fach", fach);
        params.set("klasse", klasse);
        return this.http.get(this.listBloeckeURL, {search: params}).map(this.extractData).catch(this.handleError);
    }

    loadZeugnisse(klasse: string, fach: string) : Observable<number[]> {
        let params = new URLSearchParams();
        params.set("fach", fach);
        params.set("klasse", klasse);
        return this.http.get(this.listZeugnisseURL, {search: params}).map(this.extractData).catch(this.handleError);
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