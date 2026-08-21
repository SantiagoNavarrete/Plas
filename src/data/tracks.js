import westsidegunntypebeat from '../audio/WESTSIDE.mp3';
import sinseñal from '../audio/SAQUED.mp3';
import codigoazul from '../audio/TERMINAR SI O SI TRAP HARD.mp3';
import plasImage from '../assets/PLAS.png';
import beat2 from '../assets/beat2.jpg';
import beat3 from '../assets/beat3.jpg';

export const tracks = [
  {
    id: 1,
    title: 'WESTSIDEGUNN TYPE BEAT',
    artist: 'PLAS',
    genre: 'Boombap',
    year: '2026',
    duration: '02:42',
    cover: plasImage,
    audio: westsidegunntypebeat,
  },
  {
    id: 2,
    title: 'CÓDIGO AZUL',
    artist: 'PLAS · DEMO 02',
    genre: 'Trap ',
    year: '2024',
    duration: '03:12',
    cover: beat2,
    audio: sinseñal,
  },
  {
    id: 3,
    title: 'SIN SEÑAL',
    artist: 'PLAS · DEMO 03',
    genre: 'Trap / Experimental',
    year: '2023',
    duration: '02:56',
    cover: beat3,
    audio: codigoazul,
  },
]
