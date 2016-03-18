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

export interface IModelFromTemplate<TState> {
    template: IModelTemplate<TState>
}

export interface IModelOptions {
    key?: string;
    drivers?: any;
    actions? : any;
}
