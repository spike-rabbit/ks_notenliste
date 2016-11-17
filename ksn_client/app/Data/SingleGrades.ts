import {GradeType} from "./GradeType";
import {GradeListType} from "./GradeListType";
/**
 * Created by maximilian.koeller on 15.11.2016.
 */
export interface SingleGrades {
    fachNotenListe : number;
    lehrer : string;
    datum : string;
    typ : GradeType;
    gewichtung : number;
    noten : GradeListType[];
}