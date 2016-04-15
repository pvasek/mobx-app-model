import 'mocha';
import { model } from '../model';
import { assert } from 'chai';

describe('model', () => {
    
    const target: any = model({
        state: {
            count: 0  
        },
        actions: {
            increment({state}) {
                state.count += 1;
            }
        }
    });

    describe('actions:', () => {
        it('Should map actions', () => {
            assert.equal(target.state.count, 0, 'initial state');
            target.targets.increment();        
            assert.equal(target.state.count, 1, 'after increment');
        });
    });
});