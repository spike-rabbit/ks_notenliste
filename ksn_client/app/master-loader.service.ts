/**
 * Created by maximilian.koeller on 15.11.2016.
 */
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
/**
 * Created by maximilian.koeller on 15.11.2016.
 */
@Injectable()
export class MasterLoaderService {
    private listKLassenURL = "/masterData/listKlassen";

    constructor(private http: Http) {
    }

    loadClasses(): Observable<any []> {
        return this.http.get(this.listKLassenURL).map(this.extractData).catch(this.handleError);
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