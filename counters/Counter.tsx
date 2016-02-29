import './../Object.assign';
import * as React from 'react';
import { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const toSignals = (state: any, actionObj: any) => {
    return Object.keys(actionObj).reduce((acc, key) => {
        acc[key] = function (...acc) {
            const newState = actionObj[key](state, ...acc)
            Object.assign(state, newState);
        };
        return acc;
    }, {});  
};

export const createModel = (): any => {
    const state = observable({value: 0});
    const actions = {
        increment: (state) => ({ value: state.value + 1 }), 
        decrement: (state) => ({ value: state.value - 1 }), 
        set: (state, value) => {
            value = parseInt(value, 10);
            return { value: isNaN(value) ? null : value };
        },
        reset: (state) => ({ value: 0 })
    };
    return { state, signals: toSignals(state, actions)};
};

export const View = observer(({model}: any) => {
    const counterStyle = {display: 'inline-block', padding: '2 20'};
    const state = model.state;
    const signals = model.signals;
    return (
        <div style={counterStyle}>
            <input type="text" onChange={(e: any) => signals.set(e.target.value)} value={state.value}/>
            <button onClick={signals.increment}>+</button>
            <button onClick={signals.decrement}>-</button>
            <button onClick={signals.reset}>reset</button>
        </div>
    );
});