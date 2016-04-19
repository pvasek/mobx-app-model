import { Observable } from '@reactivex/rxjs';

export interface IModelTemplate<TState> {
    state: TState;
    actions?: any;
    inputs?: any;
    extensions?: any;
}

export interface IModelOutputs {
    [name: string]: Observable<any>;    
}

export interface IModel<TState, TTargets> {
    state: TState;
    targets: TTargets;
    outpus: IModelOutputs
}

export interface IModelFromTemplate<TState> {
    template: IModelTemplate<TState>
}

export interface IModelOptions {
    key?: string;
    drivers?: any;
    actions? : any;
}
