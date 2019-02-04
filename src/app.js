import $ from 'jquery';
import Rx from 'rxjs/Rx';
import { map, catchError, scan } from 'rxjs/operators';
import { debounceTime, delay } from 'rxjs/operators';

console.log('RxJS Boiler Running...');

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
