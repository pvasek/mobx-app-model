import * as React from 'react';
import { Component } from 'react';
import { Subject, Observable } from '@reactivex/rxjs';
import { observable, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { actionsToTargets } from '../utils';

const httpDriver = (input$: Observable<any>): Subject<any> => {
    const result = new Subject();
    input$.subscribe((url: string) => {
        console.log('http$ requesting: ', url);
        fetch(url).then(i => {
           result.next(i);
        });        
    });
    return result;
};

const inputToTargets = (model, createInputs): any => {
    const inputs = createInputs(model, { http$: httpDriver}, () => new Subject());
    return Object.keys(inputs).reduce((obj: any, key: string) => {
        const input: Subject<any> = inputs[key];
        obj[key] = function targetToInput(args) {
            input.next(args);
        };
        return obj;
    }, {});
};

export interface IState {
    value: string;
    url: string;
};

export const createModel = (): any => {
    const state: IState = {
        value: '',
        url: ''
    };
    
    const actions = {        
        setSearchText({state}, value: string) {
            console.log('settting text: ', value);
            state.value = value;
        },
        
        setUrl({state}, url: string) { 
            state.url = url; 
        }
    };
    
    const inputs = (model, drivers, createInput: () => Observable<any>) => {        
        const searchInput$ = createInput();
        
            const url$ = searchInput$
                .do(i => console.log('searchInput$: ', i))
                .do(model.targets.setSearchText)
                .debounceTime(400)
                .map(i => 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=' + encodeURIComponent(i as string));

            drivers.http$(url$)
                .flatMap((i: any) => Observable.fromPromise(i.json()))
                .map((i: any) => i.data.length > 0 ? i.data[0].images.fixed_height.url : '')
                .subscribe(model.targets.setUrl);
                
        return { searchInput$ };
    };
    
    const result = { state: observable(state), targets: null };
    result.targets = actionsToTargets(result, actions);
    result.targets = Object.assign(result.targets, inputToTargets(result, inputs));
    
    return result;    
};

export const View = observer<any>(({ model: { state, targets} }) => {
    return (
        <div>
            <div>
                <input type="text" onChange={(e: any) => targets.searchInput$(e.target.value)} value={state.value}/>
                <button onClick={targets.click$}>Click</button>
            </div>
            <div>
                <img src={state.url}/>
            </div>
        </div>
    );
});