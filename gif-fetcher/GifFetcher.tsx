import * as React from 'react';
import { Component } from 'react';
import { Subject, Observable } from '@reactivex/rxjs';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export const createModel = (): any => {
    const state = {
        value: '',
        url: ''
    };
    
    const actions = {        
        setSearchText(state, value) {
            state.value = value;
        },
        
        setUrl(state, url) { 
            state.url = url; 
        }
    };
    
    
    // TODO: figure out how to write that in the model structure
    // const inputs = {
    //     searchInput$: e => e.target.value,
    //     click$: e => e
    // },
    // 
    // cycle({http$, searchInput$, click$}, model: IModel) {
    //     
    //     const foundImages$ = http$
    //         .flatMap((i: Response) => Observable.fromPromise(i.json()))
    //         .map((i: any) => i.data.length > 0 ? i.data[0].images.fixed_height_small.url : '')
    //         .subscribe(model.signals.setUrl);
    //     
    //     click$.subscribe(() => {
    //         console.log('click');
    //     });
    //     
    //     return {
    //         http$: searchInput$
    //             .do(model.signals.setSearchText)
    //             .debounceTime(400)
    //             .map(i => 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=' + encodeURIComponent(i as string))
    //     };
    // }
};

export const View = ({ model: { state, targets} }) => {
    return (
        <div>
            <div>
                <input ref="input" type="text" onChange={targets.searchInput$} value={state.value}/>
                <button onClick={targets.click$}>Click</button>
            </div>
            <div>
                <img src={state.url}/>
            </div>
        </div>
    );
};