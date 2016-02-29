import * as React from 'react';
import { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const toTargets = (model: any, actionObj: any) => {
    return Object.keys(actionObj).reduce((acc, key) => {
        acc[key] = function (...acc) {
            actionObj[key](model, ...acc)
        };
        return acc;
    }, {});  
};

export const createModel = (): any => {
    
    const state = {
        value: 0
    };
    
    const actions = {
        
        reset({state}) {
            state.value = 0;
        },
        
        increment({state}) {
            state.value += 1;
        },
         
        decrement({state}) {
            state.value -= 1;
        },
         
        set({state}, value) {
            value = parseInt(value, 10);
            state.value = isNaN(value) ? null : value;
        }        
    };
    
    const result = { state: observable(state), targets: null };
    result.targets = toTargets(result, actions);
    return result;
};

export const View = observer(({model}: any) => {
    const counterStyle = {display: 'inline-block', padding: '2 20'};
    const state = model.state;
    const targets = model.targets;
    return (
        <div style={counterStyle}>
            <input type="text" onChange={(e: any) => targets.set(e.target.value)} value={state.value}/>
            <button onClick={targets.increment}>+</button>
            <button onClick={targets.decrement}>-</button>
            <button onClick={targets.reset}>reset</button>
        </div>
    );
});