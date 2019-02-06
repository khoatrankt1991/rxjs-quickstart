import $ from 'jquery';
import Rx from 'rxjs/Rx';
import { map, catchError, scan } from 'rxjs/operators';
import { debounceTime, delay } from 'rxjs/operators';

console.log('RxJS is running...');

const btn = $('#btn');
const input = $('#input');
const output = $('#output');

const btn$ = Rx.Observable.fromEvent(btn, 'click').pipe(scan(x => x +1, 0));
btn$.subscribe(x => document.getElementById('btnOut').innerText = 'You Clicked ' + x);
const input$ = Rx.Observable.fromEvent(input, 'keyup').pipe(debounceTime(200));

const findUserByName = (name) => {
  return $.ajax({
    url: 'https://api.github.com/users/' + name,
    dataType: 'jsonp'
  }).promise();
};

const profileDOM = ({ login, avatar_url, followers, following}) => `<div><h3>${login}</h3><p>Followers: ${followers}</p><p>Followings: ${following}</p><img style="width: 100%;" src="${avatar_url}" /></div>`;

input$.subscribe(e => {
  Rx.Observable.fromPromise(findUserByName(e.target.value)).subscribe(result => {
    console.log('result is', result);
    const child = result.data.message ? 'NotFound' : profileDOM(result.data);
    document.getElementById('output').innerHTML = child; 
  })
  console.log('typed ', e.target.value);
});

const interval$ = Rx.Observable.interval(1000).take(20);
interval$.subscribe(e => {
  document.getElementById('outInterval').innerText = e;
});
const timer$ = Rx.Observable.timer(5000, 500).take(20);
timer$.subscribe(e => {
  document.getElementById('outTimer').innerText = e;
});


// rxjs map & fluck
const inputMap = $('#inputMap');
const inputMap$ = Rx.Observable.fromEvent(inputMap, 'keyup').map(e => e.target.value.toUpperCase());
inputMap$.subscribe(e => document.getElementById('outputMap').innerText = e);

const languages = [
  { name: 'java', level: 8},
  { name: 'nodejs', level: 7},
  { name: 'react', level: 6},
  { name: 'python', level: 9},
];
Rx.Observable.from(languages).pluck('name').subscribe(e => console.log('pluck name', e));

// merge & concat
  // merge
const btnStartMerge = $('#btnStartMerge');
const btnStopMerge = $('#btnStopMerge');
const btnClearMerge = $('#btnClearMerge');
const btnStopMerge$ = Rx.Observable.fromEvent(btnStopMerge, 'click');
const btnStartMerge$ = Rx.Observable.fromEvent(btnStartMerge, 'click');
const btnClearMerge$ = Rx.Observable.fromEvent(btnClearMerge, 'click');
btnStartMerge$.subscribe(e => {
  const src1$ = Rx.Observable.interval(500).pipe(scan(x => x+ 1, 0)).map(e => 'Merged 1: ' + e).takeUntil(btnStopMerge$);
  const src2$ = Rx.Observable.interval(2000).pipe(scan(x => x+ 1, 0)).map(e => 'Merged 2: ' + e).takeUntil(btnStopMerge$);
  const src$ = src1$.merge(src2$).takeUntil(btnStopMerge$);
  src$.subscribe(e => {
    console.log(e);
    const outMsg = document.createElement('p');
    outMsg.innerHTML = e;
    // $('#outputMerge').appendChild(outMsg);
    document.getElementById('outputMerge').appendChild(outMsg);
  }, err => console.log('err', err), () => console.log('Complete Interval Merge'));
  // src1$.subscribe(e => console.log(e));
  // src2$.subscribe(e => console.log(e));
})
btnStopMerge$.subscribe(e => alert('Stop merge interval'));
btnClearMerge$.subscribe(e => {
  document.getElementById('outputMerge').innerHTML = '';
});
  // concat
  const btnStartConcat = $('#btnStartConcat');
  const btnStopConcat = $('#btnStopConcat');
  const btnClearConcat = $('#btnClearConcat');
  const btnStopConcat$ = Rx.Observable.fromEvent(btnStopConcat, 'click');
  const btnStartConcat$ = Rx.Observable.fromEvent(btnStartConcat, 'click');
  const btnClearConcat$ = Rx.Observable.fromEvent(btnClearConcat, 'click');
  btnStartConcat$.subscribe(e => {
    const src1$ = Rx.Observable.interval(500).pipe(scan(x => x+ 1, 0)).map(e => 'Concat 1: ' + e).take(10);
    const src2$ = Rx.Observable.interval(2000).pipe(scan(x => x+ 1, 0)).map(e => 'Concat 2: ' + e).takeUntil(btnStopConcat$);
    const src$ = src1$.concat(src2$).takeUntil(btnStopConcat$);
    src$.subscribe(e => {
      console.log(e);
      const outMsg = document.createElement('p');
      outMsg.innerHTML = e;
      // $('#outputConcat').appendChild(outMsg);
      document.getElementById('outputConcat').appendChild(outMsg);
    }, err => console.log('err', err), () => console.log('Complete Interval Concat'));
    // src1$.subscribe(e => console.log(e));
    // src2$.subscribe(e => console.log(e));
  })
  btnStopConcat$.subscribe(e => alert('Stop concat interval'));
  btnClearConcat$.subscribe(e => {
    document.getElementById('outputConcat').innerHTML = '';
  });

  //  Rx.Observable.of('Hello').merge(Rx.Observable.of('World')).subscribe(e => console.log('Merge', e));
  const hello$ = Rx.Observable.of('Hello');
  hello$.switchMap(e => Rx.Observable.of(e + ' World')).subscribe(e => console.log('Merge', e));
  hello$.subscribe(e => console.log('hello', e));