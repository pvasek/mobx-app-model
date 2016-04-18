import 'mocha';
import { Subject } from '@reactivex/rxjs';
import { getActionsFromModelFactory } from '../../../src';
import { modelDriver } from '../modelDriver';
import { observable } from 'mobx';
import { assert } from 'chai';

describe('modelDriver', () => {
    it('should generate events after model changes', () => {
        const model = observable({
            count: 0
        });
        
        const stream$ = modelDriver((subj: Subject<any>) => {
            subj.next(model.count);     
        });
        
        let last = -1;
        stream$.subscribe(i => last = i);
        model.count = 5;
        assert.equal(5, last);
        model.count = 6;
        assert.equal(6, last);
    });
});       