import { Subject, Observable } from '@reactivex/rxjs';
import { autorun } from 'mobx';

export function modelDriver(callback: (subject: Subject<any>) => void): Observable<any> {
    const result = new Subject();
    autorun(() => {
        callback(result); 
    });    
    return result;
};
