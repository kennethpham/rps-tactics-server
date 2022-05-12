class Player {
  socketId: string;
  username: string;
  healthPoints: number | undefined;
  opponent: string | undefined;
  ready: boolean;
  leader: boolean;
  choice: string | undefined;

  constructor(player: [string, string]) {
    this.socketId = player[0];
    this.username = player[1];
    this.healthPoints = undefined;
    this.opponent = undefined;
    this.ready = false;
    this.leader = false;
    this.choice = undefined;
  }
}

export { Player as default };
