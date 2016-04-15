import { Subject, Observable } from '@reactivex/rxjs';
import { autorun } from 'mobx';

export interface ModelCallback { (subject: Subject<any>): void };

export function modelDriver(callback: ModelCallback): Observable<any> {
    const result = new Subject();
    autorun(() => {
        callback(result); 
    });    
    return result;
};
