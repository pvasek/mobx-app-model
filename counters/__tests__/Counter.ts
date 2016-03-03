import 'mocha';
import { Subject } from '@reactivex/rxjs';
import { getActionsFromModelFactory } from '../../model';
import { createModel } from '../Counter';
import { assert } from 'chai';

describe('Counter', () => {

    describe('actions:', () => {

        const actions = getActionsFromModelFactory(createModel);

        it('Should increment counter value', () => {
            const state = { value: 0 };
            actions.actions.increment({ state });
            assert.equal(state.value, 1);
            actions.actions.increment({ state });
            assert.equal(state.value, 2);
        });

        it('Should decrement counter value', () => {
            const state = { value: 0 };
            actions.actions.decrement({ state });
            assert.equal(state.value, -1);
            actions.actions.decrement({ state });
            assert.equal(state.value, -2);
        });

        it('Should reset counter value', () => {
            const state = { value: 5 };
            actions.actions.reset({ state });
            assert.equal(state.value, 0);
        });

        it('Should set counter value', () => {
            const state = { value: 0 };
            actions.actions.set({ state }, 7);
            assert.equal(state.value, 7);
        });
    });

    describe('inputs:', () => {
        
        const keyStreams = {};
        const inputs = {
            key$: (keyOpt) => {
                const stream = new Subject();
                keyStreams[keyOpt.key] = stream;
                return stream;
            }
        };
        const actions = [];
        const actionObj = {
            increment: () => actions.push('increment'),
            decrement: () => actions.push('decrement')
        };
        
        const target = createModel({drivers: inputs, actions: actionObj });
                    
        it('Should call increment action if + key is pressed', () => {
            actions.splice(0, actions.length);           
            keyStreams['+'].next(0);            
            assert.equal(actions.length, 1);
            assert.equal(actions[0], 'increment');
        });

        it('Should call increment action if - key is pressed', () => {
            actions.splice(0, actions.length);
            keyStreams['-'].next(0);
            assert.equal(actions.length, 1);
            assert.equal(actions[0], 'decrement');
        });
    });
    
    

});