import $ from 'jquery';
import Rx from 'rxjs/Rx';
// import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { debounceTime, delay } from 'rxjs/operators';

console.log('RxJS Boiler Running...');

const btn = $('#btn');
const input = $('#input');
const output = $('#output');

const input$ = Rx.Observable.fromEvent(input, 'keyup').pipe(debounceTime(2000));

const findUserByName = (name) => {
  return $.ajax({
    url: 'https://api.github.com/users/' + name,
    dataType: 'jsonp'
  }).promise();
};

const profileDOM = ({ login, avatar_url}) => `<div><h1>${login}</h1><img src="${avatar_url}" /></div>`;

input$.subscribe(e => {
  Rx.Observable.fromPromise(findUserByName(e.target.value)).subscribe(result => {
    console.log('result is', result);
    document.getElementById('output').innerHTML = profileDOM(result.data); 
  })
  console.log('typed ', e.target.value);
});
