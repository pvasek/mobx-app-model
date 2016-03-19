import * as React from 'react';
import { Component } from 'react';
import { Subject, Observable } from '@reactivex/rxjs';
import { observable, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { modelFactory, IModel } from '../../src';

export interface IState {
    value: string;
    url: string;
};

export interface ITargets {
    setSearchText(value: string): void;
    setUrl(value: string): void;
    searchInput$(value: string): void;
}

export const createModel = modelFactory<IState, ITargets>({
    state: {
        value: '',
        url: ''
    },
    
    actions: {        
        setSearchText({state}, value: string) {
            console.log('settting text: ', value);
            state.value = value;
        },
        
        setUrl({state}, url: string) { 
            state.url = url; 
        }
    },
    
    inputs(model, drivers, createInput: () => Observable<any>) {        
        
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
    }
});

export const View = observer<any>((props) => {
    const model: IModel<IState, ITargets> = props.model;
    const { state, targets } = model;
    
    return (
        <div>
            <div>
                <input type="text" onChange={(e: any) => targets.searchInput$(e.target.value)} value={state.value}/>                
            </div>
            <div>
                <img src={state.url}/>
            </div>
        </div>
    );
});