import './styles.css';
import { getRandomInt } from './utils';

const squares = document.querySelectorAll('.square');
const count = document.getElementById('count') as HTMLSpanElement;



const secret = getRandomInt(1, 6);
let guessCount = 0;
console.log(secret)
squares.forEach((sq, indx) => {
    const el = sq as HTMLDivElement;
    if ((indx + 1) === secret) {
        el.dataset.secret = 'true';
    }

    sq.addEventListener('click', handleClick)
});

function handleClick() {
    const el = this as HTMLDivElement;

    guessCount++;
    count.innerHTML = `<small>You have made <b>${guessCount}</b> guesses</small>`
    if (el.dataset.secret) {
        el.classList.add('winner');
        squares.forEach(sq => sq.removeEventListener('click', handleClick));
    } else {
        el.classList.add('loser');
        el.removeEventListener('click', handleClick);
    }
}