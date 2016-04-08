# mobx-model
A simple wrapper around [mobx](https://github.com/mobxjs/mobx). 

## Goals
- actions which are simple to test
- targets which are created from these action and can be 
  used directly in react components without binding
- have composable models
- posible side effects _(this needs to be improved)_

## Example

```javascript
    import { modelFactory } from 'mobx-factory';
    import { autorun } from 'mobx';

    export const createModel = modelFactory({ 
        
        state: {
            value: 0
        },
        
        actions: {
            
            reset({state}) {            
                state.value = 0;
            },
            
            increment({state}) {
                state.value += 1;
            },
            
            decrement({state}) {
                state.value -= 1;
            },
            
            set({state}, value) {
                value = parseInt(value, 10);
                state.value = isNaN(value) ? null : value;
            }        
        }
    });

    const model = createModel();

    autorun(() => {
        console.log(model.state.value);
    });
    
    model.targets.increment(); // 1
    model.targets.increment(); // 2    


```