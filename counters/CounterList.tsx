import * as React from 'react';
import { Component } from 'react';
import { observable, autorun, toJSON, transaction } from 'mobx';
import { observer } from 'mobx-react';
import { View as Counter, createModel as counterCreateModel } from './CounterPair';


export const createModel = () => {    
    const state = observable({counters: []});
    
    const result = { state, counters: [], actions: null };
     
    const actions = {
        addCounter: () => {
            const model = counterCreateModel();
            result.counters.push(model);
            state.counters.push(model.state);           
        }
    }
    result.actions = actions;
            
    return result;
}

export const View = observer(({ model: {state, actions, counters}}: any) => {    
    
    const items = state.counters.map((item, index) => {
        return (<Counter key={index} model={counters[index]}/>);
    });
        
    return (
        <div>
            <h2>List</h2>
            <div>
                {items}                    
            </div>
            <div>
                <button onClick={actions.addCounter}>Add counter</button>
            </div>
        </div>
    );
});
