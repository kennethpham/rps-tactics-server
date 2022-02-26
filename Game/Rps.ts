import Player from './player';
class Rps {
  private playerArr: Array<Player>;

  constructor() {
    this.playerArr = [];
  }

  addPlayer = (player: [string, string]): void => {
    this.playerArr.push(new Player(player));
  }

  removePlayer = (player: string): void => {
    const removedPlayer = this.playerArr.find(
      element => element.socketId === player
    );
    if (removedPlayer === undefined) return;
    let index = this.playerArr.indexOf(removedPlayer);
    this.playerArr.splice(index, 1);
  }

  getPlayerArr = (): Array<Player> => {
    return this.playerArr;
  }
}

export { Rps as default };
