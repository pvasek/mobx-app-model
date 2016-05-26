import './Object.assign';
import { Subject, Observable } from '@reactivex/rxjs';
import { observable, transaction } from 'mobx';

import { IModelTemplate, IModelOptions, IModel } from './types';
import { subjectDriver, httpDriver, modelDriver } from './services';

export const defaultServices = {
    http$: httpDriver,
    subject$: subjectDriver,
    model$: modelDriver
};

export function model<TState, TTargets>(
    template: IModelTemplate<TState>, 
    options?: IModelOptions): IModel<TState, TTargets> {
        
    options = options || { key: 'model' };
    const state = observable(Object.assign({}, template.state));
    
    const services = Object.assign({}, defaultServices, options.services);
    
    const result = Object.assign({ 
        key: options.key,
        state, 
        targets: null,
        template,
        services,
    }, template.extensions);
    
    if (template.actions || options.actions) {
        result.targets = actionsToTargets(result, Object.assign({}, template.actions, options.actions));
    }        
    
    if (template.inputs) {        
        const inputs = template.inputs(result, services);
        result.outputs = inputs;
        result.targets = Object.assign(result.targets, inputToTargets(inputs));
    }
    
    if (template.init) {
        template.init(result, template);
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

function actionsToTargets(model: any, actionObj: any) {
    return Object.keys(actionObj).reduce((acc, key) => {
        acc[key] = function (...acc) {
            const action = actionObj[key];
            let result = null;
            transaction(() => {
                result = action(model, ...acc);    
            });
            return result;
        };
        return acc;
    }, {});  
}

function inputToTargets(inputs): any {
    return Object.keys(inputs || {}).reduce((obj: any, key: string) => {
        const input: Subject<any> = inputs[key];
        obj[key] = function targetToInput(args) {
            input.next(args);
        };
        return obj;
    }, {});
};
