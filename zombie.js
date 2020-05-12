//default input
let input = {
  N: 4,
  initialZom: { x: 2, y: 1 },
  creatrues: [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 3, y: 1 },
  ],
  moves: 'DLUURR',
};

class Game {
  constructor({ N, initialZom, creatrues, moves }) {
    this.N = N;
    this.initialZom = initialZom;
    this.creatrues = creatrues;
    this.moves = moves;
    this.score = 0;
    //use an array to revode the trail of a zombie
    this.zombieTrial = [this.initialZom];

    this.newZombie = [];
    //use a boolean flag check if there was a new zombie
    this.isNewZombie = false;
    this.zombiePosition = [];
    //grids for visual checking
    this.grids = Array(N)
      .fill(null)
      .map(() => Array(N).fill(null));
  }

  move({ x, y }, m) {
    if (m == 'D') y += 1;
    if (m == 'U') y -= 1;
    if (m == 'L') x -= 1;
    if (m == 'R') x += 1;
    if (x == -1) x = this.N - 1;
    if (y == -1) y = this.N - 1;
    if (x >= this.N) x = 0;
    if (y >= this.N) y = 0;
    let next = { x, y };
    this.zombieTrial.push(next);
    //check if any creature was turned to zombie
    this.creatrues.forEach((c) => {
      if (c.x === x && c.y === y) {
        //if the creature has already been turned to zombie break this loop
        if (this.newZombie.find((z) => z.x === x && z.y === y)) {
          return;
        } else {
          this.newZombie.push({ x, y });
          this.score++;
          return;
        }
      }
    });
  }
  //render visual grids
  initGrids() {
    this.creatrues.forEach((c) => {
      this.grids[c.y][c.x] = 'C';
    });
    this.zombieTrial.forEach((z) => {
      this.grids[z.y][z.x] = 'Z';
    });
  }
  renderGrids() {
    this.zombieTrial.forEach((z) => {
      this.grids[z.y][z.x] = 'Z';
    });
  }
  //each zombie moves as following
  moveOneTime() {
    //loop all the moves
    this.moves.split('').forEach((m) => {
      this.move(this.zombieTrial[this.zombieTrial.length - 1], m);
    });
    //record the last position
    this.renderGrids();
    this.zombiePosition.push(this.zombieTrial[this.zombieTrial.length - 1]);
    this.isNewZombie = this.check();
    this.zombieTrial = [...this.newZombie];
    this.newZombie = [];
  }
  check() {
    return this.newZombie.length > 0 ? true : false;
  }
  runGame() {
    this.moveOneTime();
    while (this.isNewZombie) {
      this.moveOneTime();
    }
  }
  result() {
    return { zombiePosition: this.zombiePosition, score: this.score };
  }
}
var g = new Game(input);
g.runGame();
g.result();
