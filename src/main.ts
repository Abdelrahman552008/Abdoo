import Phaser from 'phaser';
import './style.css';
import { WorldScene } from './game/scenes/WorldScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#c8b58c',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 600,
  },
  render: { antialias: true, pixelArt: false },
  scene: [WorldScene],
});

document.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((button) => {
  button.addEventListener('click', () => game.events.emit('player-step', button.dataset.step));
});

let minute = 0;
const timeLabel = document.querySelector<HTMLElement>('#game-time');
window.setInterval(() => {
  minute += 1;
  const total = 8 * 60 + minute;
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  const period = hours < 12 ? 'صباحًا' : 'مساءً';
  const shownHour = hours % 12 || 12;
  const arabic = (value: number) => String(value).replace(/[0-9]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
  if (timeLabel) timeLabel.textContent = `اليوم الأول · ${arabic(shownHour)}:${arabic(minutes).padStart(2, '٠')} ${period}`;
}, 5000);

window.addEventListener('beforeunload', () => game.destroy(true));