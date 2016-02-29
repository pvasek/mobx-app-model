import * as React from 'react';
import { render } from 'react-dom';
import { observable, autorun, toJSON, map, asFlat, observe, expr } from 'mobx';
import { observer } from 'mobx-react';


const store1 = observable({
    title: 'test',
    focused: null,
    test() {
        return this.title + '!!!';
    }
});

const store2 = observable({
    count: 0
})

console.time('generating template...')
const template = [];
for (let i = 0; i < 1000; i++) {
    const item = { id: i, focus: 0};
    for(let j = 0; j < 50; j++) {
        item['property_name_' + j] = "property " + i + "__" + j;
    }
    template.push(item);
}
console.timeEnd('generating template...');

console.time('creating observable...');
const store = observable(template);
console.timeEnd('creating observable...');

//(autorun as any)(() => console.log('autorun', toJSON(store)));
//(autorun as any)(() => console.log('autorun2', toJSON(store2)));


let count = 0;

setInterval(function() {
    const idx = Math.ceil(Math.random() * template.length) - 1;
    store[idx].property_name_0 = "this is new text " + new Date()  
}, 500);


const MyRow = observer((props: any) => {
    const { item } = props;
    return (<tr>
                <td>{item.id}</td>
                <td>{item.property_name_0}</td>
                <td onClick={() => item.property_name_1 = count++}>{item.property_name_1}</td>
                <td><input ref="input" type="text" value={item.property_name_2} onChange={(e: any) => item.property_name_2 = e.target.value}/></td>
                <td onClick={() => store1.focused = item}>{item.property_name_2}</td>
                <td>{item.property_name_4}</td>
                <td>{item.property_name_5}</td>
                <td>{item.property_name_6}</td>
                <td>{item.property_name_7}</td>
            </tr>)    
});

//const View = observer((props: any) => (<div>{props.store.title}</div>));
const MyTable = observer((props: any) => (
    <table>
        <tbody>
        { props.store.map(i => {
            return (
            <MyRow key={i.id} item={i}/>
        )}) }  
        </tbody>
    </table>)
);

const store12 = observable({ count: store2.count, title: store1.title});

const MyComp = observer(({store}: any) => {
    
    return (
    <div>
        <div>
            <label onClick={() => store.title = new Date().toTimeString()}>Title</label><span>{store.title}</span>
        </div>
        <div>
            <label onClick={() => store.count = new Date().getMilliseconds()}>Count</label><span>{store.count}</span>
        </div>
    </div>)
});

const Root = (props: any) => (
    <div>
        <h1>Table3</h1>
        <MyComp store={store12}/>
        <MyTable store={props.store}/>
    </div>
);

console.time('rendering...');
const appElement = document.getElementById('app');
render(<Root store={store} />, appElement);
console.timeEnd('rendering...');