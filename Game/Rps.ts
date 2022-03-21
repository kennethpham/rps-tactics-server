import Player from './Player';

class Rps {
  private players: Player[];
  private readyArr: boolean[];

  constructor() {
    this.players = [];
    this.readyArr = [];
  }

  getPlayerArr = (): Player[] => {
    return this.players;
  }

  getReadyArr = (): boolean[] => {
    return this.readyArr;
  }

  getPlayersActive = (): number => {
    let count = 0;
    this.players.forEach((player) => {
      if (player.healthPoints !== undefined && player.healthPoints > 0) {
        count++;
      }
    });
    return count;
  }

  addPlayer = (player: [string, string]): void => {
    this.players.push(new Player(player));
    this.readyArr.push(false);
    // if only one player then they are the leader
    if (this.players.length === 1) {
      this.players[0].leader = true;
    }
  }

  removePlayer = (player: string): void => {
    const removedPlayer = this.players.find(
      element => element.socketId === player
    );
    if (removedPlayer === undefined) return;
    let index = this.players.indexOf(removedPlayer);
    this.players.splice(index, 1);
    this.readyArr.splice(index, 1);
  }

  toggleReady = (player: string): void => {
    const currPlayer = this.players.find(
      (element) => element.socketId === player
    );
    if (currPlayer === undefined) return;
    const index = this.players.indexOf(currPlayer);
    this.players[index].ready = !this.players[index].ready;
    this.readyArr[index] = !this.readyArr[index];
  }

  toggleLeader = (player: string): void => {
    const currPlayer = this.players.find(
      (element) => element.socketId === player
    );
    if (currPlayer === undefined) return;
    currPlayer.leader = !currPlayer.leader;
  }

  startGame = (): void => {
    this.players.forEach((player) => {
      player.healthPoints = 5;
    });
  }

  matchPlayers = (): void => {
    const active: Player[] = [];
    this.players.forEach((player) => {
      if (player.healthPoints !== undefined && player.healthPoints > 0) {
        active.push(player);
      }
    });
    while (active.length > 1) {
      const curr = active[0];
      const oppIndex = Math.random() * (active.length-1 + 1) + 1;
      curr.opponent = active[oppIndex];
      active[oppIndex].opponent = curr;
      active.splice(oppIndex, 1);
      active.splice(0, 1);
    }
  }
}

export { Rps as default };
