import './Object.assign';
import { Subject, Observable } from '@reactivex/rxjs';
import { observable } from 'mobx';

export function actionsToTargets(model: any, actionObj: any) {
    return Object.keys(actionObj).reduce((acc, key) => {
        acc[key] = function (...acc) {
            actionObj[key](model, ...acc)
        };
        return acc;
    }, {});  
}

export function httpDriver(input$: Observable<any>): Subject<any> {
    const result = new Subject();
    input$.subscribe((url: string) => {
        fetch(url).then(i => {
           result.next(i);
        });        
    });
    return result;
};

export function inputToTargets(model, createInputs): any {
    const inputs = createInputs(model, { http$: httpDriver}, () => new Subject());
    return Object.keys(inputs).reduce((obj: any, key: string) => {
        const input: Subject<any> = inputs[key];
        obj[key] = function targetToInput(args) {
            input.next(args);
        };
        return obj;
    }, {});
};


export interface IModelTemplate<TState> {
    state: TState;
    actions?: any;
    inputs?: any;
    extensions?: any;
}

export interface IModel<TState, TTargets> {
    state: TState;
    targets: TTargets    
}

export interface IModelOptions {
    key?: string;
}

export function model<TState, TTargets>(
    template: IModelTemplate<TState>, 
    options?: IModelOptions): IModel<TState, TTargets> {
        
    options = options || { key: 'model' };
    const state = observable(Object.assign({}, template.state));
    
    const result = Object.assign({ 
        key: options.key,
        state, 
        targets: null 
    }, template.extensions);
    
    if (template.actions) {
        result.targets = actionsToTargets(result, template.actions);
    }
    
    if (template.inputs) {
        result.targets = Object.assign(result.targets, inputToTargets(result, template.inputs));
    }
    
    console.log('model: ', result);
    return result;
}

export function modelFactory<TState, TTargets>(
    template: IModelTemplate<TState>): (options?: IModelOptions) => IModel<TState, TTargets> {
    return (options?: IModelOptions) => model<TState, TTargets>(template, options);
}