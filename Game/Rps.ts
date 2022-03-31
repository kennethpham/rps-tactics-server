import Player from './Player';

class Rps {
  private players: Player[];
  private readyArr: boolean[];
  private prevRound: string[];

  constructor() {
    this.players = [];
    this.readyArr = [];
    this.prevRound = [];
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
    this.prevRound = [];
    this.players.forEach((player) => {
      player.choice = undefined;
      if (player.healthPoints !== undefined && player.healthPoints > 0) {
        active.push(player);
        this.prevRound.push(player.socketId);
      }
    });
    while (active.length > 1) {
      const curr = active[0];
      const oppIndex = Math.floor(Math.random() * (active.length - 1 - 1 + 1) + 1);
      console.log(`rand oppIndex = ${oppIndex}`);
      curr.opponent = active[oppIndex].socketId;
      active[oppIndex].opponent = curr.socketId;
      active.splice(oppIndex, 1);
      active.splice(0, 1);
    }
  }
  resolvePlayers = (): void => {
    this.prevRound.forEach((player) => {
      const playerIndex = this.players.findIndex((currPlayer) => {
        currPlayer.socketId === player;
      });
      const currPlayer = this.players[playerIndex];
      if (currPlayer.opponent === undefined) {
        return;
      }
      if (currPlayer.choice === undefined) {
        currPlayer.healthPoints!--;
        if (currPlayer.healthPoints! === 0) {
          this.players.splice(playerIndex, 1);
          this.players.push(currPlayer);
        }
      } else {
        const oppIndex = this.players.findIndex((opp) => {
          opp.socketId === currPlayer.opponent;
        });
        const opp = this.players[oppIndex];
        if (opp.choice === undefined) {
          return;
        } else if (opp.choice === currPlayer.choice) {
          return;
        } else if (currPlayer.choice === 'rock') {
          if (opp.choice === 'paper') {
            currPlayer.healthPoints!--;
          }
        } else if (currPlayer.choice == 'paper') {
          if (opp.choice === 'scissors') {
            currPlayer.healthPoints!--;
          }
        } else {
          if (opp.choice === 'rock') {
            currPlayer.healthPoints!--;
          }
        }
        if (currPlayer.healthPoints! === 0) {
          this.players.splice(playerIndex, 1);
          this.players.push(currPlayer);
        }
      }
    });
  }

  setChoice = (id: string, choice: string) => {
    const player = this.players.find((player) => {
      player.socketId === id;
    });
    if (player === undefined) return;
    player!.choice = choice;
  }
}

export { Rps as default };
