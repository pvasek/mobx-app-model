import * as React from 'react';
import { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { modelFactory } from '../model';

export interface IState {
    value: number;
}

export interface ITargets {
    reset(): void;
    increment(): void;
    decrement(): void;
    set(value: number): void;
}

export const createModel = modelFactory<IState, ITargets>({
    
    state: {
        value: 0
    },
    
    actions: {
        
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
    }
});

export const View = observer<any>(({model: { state, targets }}) => {
    const counterStyle = {display: 'inline-block', padding: '2 20'};
    return (
        <div style={counterStyle}>
            <input type="text" onChange={(e: any) => targets.set(e.target.value)} value={state.value}/>
            <button onClick={targets.increment}>+</button>
            <button onClick={targets.decrement}>-</button>
            <button onClick={targets.reset}>reset</button>
        </div>
    );
});