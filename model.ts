import './Object.assign';
import { Subject, Observable } from '@reactivex/rxjs';
import { observable } from 'mobx';

export const defaultDrivers = {
    http$: httpDriver
};

export function actionsToTargets(model: any, actionObj: any) {
    return Object.keys(actionObj).reduce((acc, key) => {
        acc[key] = function (...acc) {
            actionObj[key](model, ...acc)
        };
        return acc;
    }, {});  
}

export function keyDriver (document: Document) {
    const subject = new Subject<KeyboardEvent>();
    document.addEventListener('keydown', function keyDown(e:KeyboardEvent){
        console.log('key: ', e.key)
        subject.next(e);    
    });
    
    return function keyDriverFunc(options: any) {
        return subject.filter(i => i.key === options.key 
            && (!options.ctrlKey || i.ctrlKey)
            && (!options.altKey || i.altKey)
            && (!options.shiftKey || i.shiftKey));
    }        
}

export function httpDriver(input$: Observable<any>, options?: RequestInit): Subject<any> {
    const result = new Subject();
    input$.subscribe((url: string) => {
        fetch(url, options).then(i => {
           result.next(i);
        });        
    });
    return result;
};

export function inputToTargets(model, createInputs): any {
    const inputs = createInputs(model, defaultDrivers, () => new Subject());
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