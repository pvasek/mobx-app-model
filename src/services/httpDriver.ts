import { Subject, Observable } from '@reactivex/rxjs';

export function httpDriver(input$: Observable<any>, options?: RequestInit): Subject<any> {
    const result = new Subject();
    input$.subscribe((url: string) => {
        fetch(url, options).then(i => {
           result.next(i);
        });        
    });
    return result;
};
