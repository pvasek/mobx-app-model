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
        },
        inputs(model, drivers) {
            return { testOutput$: drivers.subject$() };
        }
    });

    describe('actions:', () => {
        it('Should map actions', () => {
            assert.equal(target.state.count, 0, 'initial state');
            target.targets.increment();        
            assert.equal(target.state.count, 1, 'after increment');
        });
    });
    
    describe('outputs:', () => {
        it('Should be bind to inputs', () => {
            assert.ok(target.outputs.testOutput$);
            let callCount = 0;
            target.outputs.testOutput$.subscribe(() => callCount++);                        
            target.targets.testOutput$();
            assert.equal(1, callCount);
            target.targets.testOutput$();
            assert.equal(2, callCount);
        })
    })
});