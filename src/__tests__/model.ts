import 'mocha';
import { autorun } from 'mobx';
import { model } from '../model';
import { assert } from 'chai';

describe('model', () => {
    
    const target: any = model({
        state: {
            count: 0,
            dynamicState: null,
            initialDynamicState: 1
        },
        actions: {
            increment({state}) {
                state.count += 1;
            },
            doubleIncrement({state}) {
                state.count += 1;                
                state.count += 1;
            },
            count() {
                return 10;
            }
        },
        inputs(model, drivers) {
            assert.ok(model);
            assert.ok(model.state);
            return { testOutput$: drivers.subject$() };
        }
    });

    describe('actions:', () => {
        it('Should map actions', () => {
            assert.equal(target.state.count, 0, 'initial state');
            target.targets.increment();        
            assert.equal(target.state.count, 1, 'after increment');
        });

        it('Actions should run in transaction', () => {
            target.state.count = 0;
            let callCount = 0;
            autorun(() => {
                const count = target.state.count;
                callCount++; 
            });
            
            callCount = 0;
            assert.equal(target.state.count, 0, 'initial state');
            target.targets.doubleIncrement();
            assert.equal(target.state.count, 2, 'after double increment');
            assert.equal(callCount, 1);    
        });
        
        it('Actions should return results', () => {
            assert.equal(target.targets.count(), 10);
        })
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
    });
    
    describe('init:', () => {
        it('Should be called during creation', () => {
            const myTarget: any = model({
                state: {
                    count: 0,
                },
                init(model, template) {
                    model.test = 1;
                }
            });

            assert.equal(1, myTarget.test);
        });
    });
});