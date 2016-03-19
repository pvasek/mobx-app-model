import * as React from 'react';
import { Component } from 'react';
import { observable, autorun, toJSON, transaction } from 'mobx';
import { observer } from 'mobx-react';
import { model } from '../../src';
import { View as Counter, createModel as counterCreateModel } from './Counter';

export const createModel = () => {
    
    const left = counterCreateModel({key: 'left'});
    const right = counterCreateModel({key: 'right'});

    const result = model<any, any>({
        state: {
            left: left.state,
            right: right.state
        },
        actions: {
            reset: () => {
                transaction(() => {
                    left.targets.reset();
                    right.targets.reset();
                });
            }
        },
        extensions: {
            left,
            right
        }
    });
    return result;
}

export const View = ({ model }: any) => {
    const boxStyle = {float:'left', minWidth: 180};
    return (
        <div style={boxStyle}>
            <Counter model={model.left}/>
            <Counter model={model.right}/>
            <button onClick={model.targets.reset}>reset</button>
        </div>
    );
};