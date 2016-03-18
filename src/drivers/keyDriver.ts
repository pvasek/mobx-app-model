import { Subject, Observable } from '@reactivex/rxjs';

const map = {
        '8': 'backspace',
        '9': 'tab',
        '13': 'enter',
        '16': 'shift',
        '17': 'ctrl',
        '18': 'alt',
        '19': 'pause',
        '20': 'capslock',
        '27': 'esc',
        '32': 'space',
        '33': 'pageup',
        '34': 'pagedown',
        '35': 'end',
        '36': 'home',
        '37': 'leftarrow',
        '38': 'uparrow',
        '39': 'rightarrow',
        '40': 'downarrow',
        '44': 'printscreen',
        '45': 'insert',
        '46': 'delete',
        '91': 'win',
        '93': 'menu',
        '144': 'numlock',
        '145': 'scrolllock',
        '188': ',',
        '190': '.',
        '191': '/',
        '192': '`',
        '219': '[',
        '220': '\\',
        '221': ']',
        '222': '"',
        '107': '+',
        '109': '-'
    };
    
export function toKey(keyCode: number): string {    

    let result = map[keyCode];
    if (result) { 
        return result;
    }
    
    if (keyCode >= 112 && keyCode <= 123) {
        return 'f' + (keyCode - 111).toString();        
    }
    
    return String.fromCharCode(keyCode);  
}

export function keyDriver (document: Document): (options: any) => Observable<KeyboardEvent> {
    const subject = new Subject<KeyboardEvent>();
    document.addEventListener('keyup', function keyDown(e:KeyboardEvent){
        e.key = e.key || toKey(e.keyCode);
        subject.next(e);    
    });    
    
    return function keyDriverFunc(options: any) {        
        return subject.filter(i => i.key === options.key 
            && (!options.ctrlKey || i.ctrlKey)
            && (!options.altKey || i.altKey)
            && (!options.shiftKey || i.shiftKey));
    }        
}
