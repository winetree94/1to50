
const $root = document.getElementById('root');
const $timer = document.getElementById('timer');

class Board {

  constructor (
    $root,
  ) {
    this.$root = $root;
    this.$board = document.createElement('div');
    this.$board.classList.add('board-container');
    this.$root.appendChild(this.$board);
    this.numberContainers = Array.from(new Array(25)).map(() => new NumberContainer(this));
    this.numbers = Array.from(new Array(50)).map((c, i) => i + 1);
    this.previousNumber = 0;

    this.shuffleArray(this.numbers.splice(0, 25)).forEach((num, index) => {
      this.numberContainers[index].number = num;
    });

    this.date = new Date();
    this.interval = setInterval(() => {
      let differ = new Date() - this.date;

      const minutes = Math.floor(differ / 1000 / 60)
      const seconds = ((differ / 1000) % 60).toFixed(2);

      $timer.innerHTML = `${minutes} M ${seconds} S`;
    }, 10);
  }

  onSelect(numberContainer) {
    const selectedNumber = numberContainer.number;
    
    if (this.previousNumber + 1 === selectedNumber) {
      const next = this.numbers.shift();
      numberContainer.number = next || '';
      this.previousNumber++;
    }

    if (this.previousNumber === 50) {
      alert('깻네 시발');
      clearInterval(this.interval);
    }

  }

  shuffleArray(array) {
    let curId = array.length;
    while (0 !== curId) {
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }

  getEmptyNumberContainer() {
    return this.numberContainers.find(container => !container.number);
  }

  destroy() {
    this.$root.innerHTML = '';
    $timer.innerHTML = '';
    clearInterval(this.interval);
  }
}

class NumberContainer {

  constructor(board, number) {
    this.board = board;
    this.$number = document.createElement('div');
    this.$number.classList.add('number-container');
    this.$number.addEventListener('click', this.onClick.bind(this));
    this.board.$board.append(this.$number);
  }

  get number() {
    return Number(this.$number.innerHTML);
  }

  set number(num) {
    this.$number.innerHTML = num;
  }

  onClick(e) {
    this.board.onSelect(this);
  }
  
}

let game;
document.getElementById('start-game').addEventListener('click', () => {
  if (game) {
    game.destroy();
  }
  game = new Board($root);
});


document.getElementById('reset-game').addEventListener('click', () => {
  if (game) {
    game.destroy();
  }
});