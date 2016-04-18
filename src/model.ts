import './Object.assign';
import { Subject, Observable } from '@reactivex/rxjs';
import { observable } from 'mobx';

import { IModelTemplate, IModelOptions, IModel } from './types';
import { subjectDriver, httpDriver, modelDriver } from './drivers';

export const defaultDrivers = {
    http$: httpDriver,
    subject$: subjectDriver,
    model$: modelDriver
};

export function model<TState, TTargets>(
    template: IModelTemplate<TState>, 
    options?: IModelOptions): IModel<TState, TTargets> {
        
    options = options || { key: 'model' };
    const state = observable(Object.assign({}, template.state));
    
    const result = Object.assign({ 
        key: options.key,
        state, 
        targets: null,
        template
    }, template.extensions);
    
    if (template.actions || options.actions) {
        result.targets = actionsToTargets(result, Object.assign({}, template.actions, options.actions));
    }
    
    if (template.inputs) {
        result.targets = Object.assign(result.targets, inputToTargets(result, template.inputs, options.drivers));
    }
    
    return result;
}

export function modelFactory<TState, TTargets>(
    template: IModelTemplate<TState>): (options?: IModelOptions) => IModel<TState, TTargets> {
    const result = (options?: IModelOptions) => model<TState, TTargets>(template, options);
    (result as any).__template = template;
    return result;
}

export function getActionsFromModel(model: any): any {
    return (model as any).template.actions;
}

export function getActionsFromModelFactory(modelFactory: Function): any {
    return (modelFactory as any).__template;
}

export function actionsToTargets(model: any, actionObj: any) {
    return Object.keys(actionObj).reduce((acc, key) => {
        acc[key] = function (...acc) {
            actionObj[key](model, ...acc)
        };
        return acc;
    }, {});  
}

export function inputToTargets(model, createInputs, drivers = {}): any {
    drivers = Object.assign({}, defaultDrivers, drivers);
    const inputs = createInputs(model, drivers);
    return Object.keys(inputs || {}).reduce((obj: any, key: string) => {
        const input: Subject<any> = inputs[key];
        obj[key] = function targetToInput(args) {
            input.next(args);
        };
        return obj;
    }, {});
};
