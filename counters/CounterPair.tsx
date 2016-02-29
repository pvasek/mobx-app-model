import * as React from 'react';
import { Component } from 'react';
import { observable, autorun, toJSON, transaction } from 'mobx';
import { observer } from 'mobx-react';
import { View as Counter, createModel as counterCreateModel } from './Counter';

export const createModel = () => {
    
    const left = counterCreateModel();
    const right = counterCreateModel();
    
    const state = observable({
        left: left.state,
        right: right.state
    });
    
    const actions = {
        reset: () => {
            transaction(() => {
                left.signals.reset();
                right.signals.reset();
            });
        }
    };
    
    return { 
        state, 
        signals: actions,
        left,
        right
    };
}

export const View = ({ model }: any) => {
    const boxStyle = {float:'left', minWidth: 180};
    return (
        <div style={boxStyle}>
            <Counter model={model.left}/>
            <Counter model={model.right}/>
            <button onClick={model.signals.reset}>reset</button>
        </div>
    );
};