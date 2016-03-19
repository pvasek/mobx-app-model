import { 
    model, 
    modelFactory, 
    defaultDrivers, 
    getActionsFromModelFactory 
} from './model';

import { 
    IModel, 
    IModelOptions, 
    IModelTemplate 
} from './types';

import {
    keyDriver    
} from './drivers/keyDriver';

import {
    httpDriver    
} from './drivers/httpDriver';

export {
    model,
    modelFactory,
    defaultDrivers,
    getActionsFromModelFactory,
    
    IModel,
    IModelOptions,
    IModelTemplate,
    
    keyDriver,
    httpDriver
}