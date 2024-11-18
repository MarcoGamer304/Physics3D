import { AudioListener, Audio, AudioLoader } from 'three';

const audioChanged = ['../../../public/sounds/track1.mp3', '../../../public/sounds/track2.mp3', '../../../public/sounds/track3.mp3', '../../../public/sounds/track4.mp3'];

export default function AudioPlayer(camera) {
    const listener = new AudioListener();
    camera.add(listener);
    const sound = new Audio(listener);
    const audioLoader = new AudioLoader();

    function randomTrack() {
        const randomTrack = audioChanged[Math.floor(Math.random() * audioChanged.length)];
        audioLoader.load(randomTrack, function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    }

    document.addEventListener('keydown', () => {
        if (!sound.isPlaying) {
            randomTrack();
        }
    });
}

