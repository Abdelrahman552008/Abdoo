import Phaser from 'phaser';

type Direction = 'up' | 'down' | 'left' | 'right';

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private lastStep = 0;

  constructor() { super('WorldScene'); }

  create() {
    this.drawNeighborhood();
    this.createPlayer();
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;
    this.game.events.on('player-step', this.onTouchStep, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.game.events.off('player-step', this.onTouchStep, this));
  }

  update(time: number) {
    if (time - this.lastStep < 125) return;
    const keys = this.wasd;
    if (this.cursors.left.isDown || keys.A.isDown) this.move('left');
    else if (this.cursors.right.isDown || keys.D.isDown) this.move('right');
    else if (this.cursors.up.isDown || keys.W.isDown) this.move('up');
    else if (this.cursors.down.isDown || keys.S.isDown) this.move('down');
  }

  private onTouchStep(direction: Direction) { this.move(direction); }

  private move(direction: Direction) {
    if (!this.player) return;
    const distance = 15;
    if (direction === 'left') this.player.x -= distance;
    if (direction === 'right') this.player.x += distance;
    if (direction === 'up') this.player.y -= distance;
    if (direction === 'down') this.player.y += distance;
    this.player.x = Phaser.Math.Clamp(this.player.x, 25, this.scale.width - 25);
    this.player.y = Phaser.Math.Clamp(this.player.y, 25, this.scale.height - 25);
    this.lastStep = this.time.now;
  }

  private drawNeighborhood() {
    const g = this.add.graphics();
    const w = this.scale.width, h = this.scale.height;
    g.fillStyle(0xb9a57d).fillRect(0, 0, w, h);
    g.fillStyle(0x68645a).fillRect(0, h * 0.38, w, h * 0.28);
    g.fillStyle(0xd1bd91).fillRect(0, h * 0.34, w, h * 0.04);
    g.fillStyle(0xd1bd91).fillRect(0, h * 0.66, w, h * 0.04);
    g.lineStyle(3, 0xe3d3ad, 0.65);
    for (let x = 0; x < w; x += 70) g.lineBetween(x, h * 0.52, x + 35, h * 0.52);
    this.building(g, 35, 35, 220, 150, 0xb96f4b, 'قهوة المعلم');
    this.building(g, 300, 28, 250, 165, 0xd6b77f, 'مخبز الحارة');
    this.building(g, w - 260, 30, 220, 155, 0x9b8263, 'بيت أم حسن');
    this.building(g, 55, h - 165, 230, 125, 0x9b7958, 'دكان عم سيد');
    this.building(g, w - 280, h - 165, 235, 125, 0xc18c61, 'محل العطارة');
    [275, 590, w - 300].forEach((x, i) => {
      const y = i === 1 ? h * 0.78 : h * 0.24;
      g.fillStyle(0x76543a).fillRect(x - 4, y, 8, 25);
      g.fillStyle(0x52734b).fillCircle(x, y, 19);
      g.fillStyle(0x6f8b55).fillCircle(x - 7, y - 7, 10);
    });
    [120, w - 120].forEach(x => {
      g.fillStyle(0x45433d).fillRect(x, h * 0.43, 4, 48);
      g.fillStyle(0xe6d39b).fillCircle(x + 2, h * 0.43, 7);
    });
    for (let i = 0; i < 5; i++) {
      const x = 330 + i * 62;
      g.fillStyle(i % 2 ? 0x9d5141 : 0xe0c28b).fillRect(x, h * 0.72, 48, 30);
      g.fillStyle(0x55483a).fillRect(x + 5, h * 0.77, 38, 32);
    }
    this.add.text(w / 2, h * 0.52, 'ميدان الحارة', { fontFamily: 'Tahoma', fontSize: '16px', color: '#f1e5c9', stroke: '#393630', strokeThickness: 4 }).setOrigin(0.5);
  }

  private building(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number, label: string) {
    g.fillStyle(0x51483c, 0.35).fillRoundedRect(x + 7, y + 9, w, h, 5);
    g.fillStyle(color).fillRoundedRect(x, y, w, h, 5);
    g.fillStyle(0xe2c99b, 0.65).fillRect(x + 8, y + 8, w - 16, 7);
    g.fillStyle(0x604b39).fillRect(x + w * 0.42, y + h - 48, w * 0.16, 48);
    for (let wx = x + 22; wx < x + w - 20; wx += 48) {
      g.fillStyle(0x52616a).fillRect(wx, y + 30, 23, 28);
      g.lineStyle(2, 0xe9d3a9).strokeRect(wx, y + 30, 23, 28);
    }
    this.add.text(x + w / 2, y + h - 12, label, { fontFamily: 'Tahoma', fontSize: '12px', color: '#fff0d4', stroke: '#4a392b', strokeThickness: 3 }).setOrigin(0.5, 1);
  }

  private createPlayer() {
    const shadow = this.add.ellipse(0, 12, 23, 9, 0x27231d, 0.3);
    const body = this.add.circle(0, 0, 10, 0x3c6475).setStrokeStyle(2, 0xf4d8ad);
    const head = this.add.circle(0, -12, 7, 0xc98d68).setStrokeStyle(1, 0x503d32);
    this.player = this.add.container(this.scale.width / 2, this.scale.height / 2 + 35, [shadow, body, head]).setDepth(10);
  }
}