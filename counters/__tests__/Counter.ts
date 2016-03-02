import 'mocha';
import { getActionsFromModelFactory } from '../../model';
import { createModel } from '../Counter';
import { assert } from 'chai';

describe('Counter', () => {
    
   describe('actions:', () => {
      
      const actions = getActionsFromModelFactory(createModel);

      it('Should increment counter value', () => {        
        const state = { value: 0 };
        actions.actions.increment({state});
        assert.equal(state.value, 1);
        actions.actions.increment({state});
        assert.equal(state.value, 2);        
      });
      
      it('Should decrement counter value', () => {        
        const state = { value: 0 };
        actions.actions.decrement({state});
        assert.equal(state.value, -1);
        actions.actions.decrement({state});
        assert.equal(state.value, -2);        
      });

      it('Should reset counter value', () => {        
        const state = { value: 5 };
        actions.actions.reset({state});
        assert.equal(state.value, 0);
      });

      it('Should set counter value', () => {        
        const state = { value: 0 };
        actions.actions.set({state}, 7);
        assert.equal(state.value, 7);
      });
   });
   
});