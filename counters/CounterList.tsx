import * as React from 'react';
import { Component } from 'react';
import { observable, autorun, toJSON, transaction } from 'mobx';
import { observer } from 'mobx-react';
import { modelFactory } from '../model';
import { View as Counter, createModel as counterCreateModel } from './CounterPair';


export const createModel = modelFactory({    
    state: {
        counters: []
    },
    actions: {
        addCounter: (model) => {
            const counterModel = counterCreateModel();
            model.counters.push(counterModel);
            model.state.counters.push(counterModel.state);           
        }
    },
    extensions: {
        counters: []
    }
});

export const View = observer<any>((props) => {    
    
    const { state, targets, counters } = props.model;
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
                <button onClick={targets.addCounter}>Add counter</button>
            </div>
        </div>
    );
});
