class Player {
  socketId: string;
  username: string;

  constructor(player: [string, string]) {
    this.socketId = player[0];
    this.username = player[1];
  }
}

export { Player as default };
