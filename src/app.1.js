import $ from 'jquery';
import Rx from 'rxjs/Rx';
import { debounce, debounceTime, delay } from 'rxjs/operators';

console.log('RxJS Boiler Running...');

const btn = $('#btn');
const input = $('#input');
const output = $('#output');
const btnStream$ = Rx.Observable.fromEvent(btn, 'click').pipe(debounceTime(1000));

btnStream$.subscribe(e => {
  console.log('clicked');
})
const inputStream$ = Rx.Observable.fromEvent(input, 'keyup').pipe(debounceTime(500));

inputStream$.subscribe(e => output.html('Start calling with debounce time = 500:  ' +e.target.value));


const skills = [
  {
    name: 'Java',
    level: 8
  },
  {
    name: 'NodeJS',
    level: 8
  },
  {
    name: 'React',
    level: 8
  },
];
const skill$ = Rx.Observable.from(skills).pipe(delay(10000));
skill$.subscribe(
  e => console.log('value is', e),
  err => console.log('ERROR here', err),
  () => console.log('Completed')
);
const exampleDebouce = Rx.Observable.of('2222').pipe(delay(10000));
exampleDebouce.subscribe(v => console.log('hic ', v));
const btn3 = $('#btn3');
const btn3$ = Rx.Observable.fromEvent(btn3, 'click');
// btn3$.subscribe(v => console.log('btn3 clicked3333'));  
const myObservable = new Rx.Observable(observer => {
  btn3$.subscribe(v => observer.next('triggle event'));
}).pipe(debounceTime(5000));

const func = () => console.log('dkmdkmdkm');
myObservable.subscribe(func);