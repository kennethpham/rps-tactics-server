class Player {
  socketId: string;
  username: string;
  healthPoints: number | undefined;
  opponent: Player | undefined;
  ready: boolean;
  leader: boolean;

  constructor(player: [string, string]) {
    this.socketId = player[0];
    this.username = player[1];
    this.healthPoints = undefined;
    this.opponent = undefined;
    this.ready = false;
    this.leader = false;
  }
}

export { Player as default };
