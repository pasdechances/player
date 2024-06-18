const fs = require('fs').promises;
const path = require('path');

const musicDir = path.join(__dirname, 'musics');

async function getMusicFiles() {
    let musicFiles = [];

    try {
        const files = await fs.readdir(musicDir);
        musicFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.mp3' || ext === '.mp4';
        });
    } catch (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    return musicFiles;
}

async function getMusicFilePath(index) {
    const musicFiles = await getMusicFiles();
    if (musicFiles.length === 0 || index >= musicFiles.length) {
        return null;
    }

    return {
        filename: musicFiles[index],
        index: index,
        path: path.join(musicDir, musicFiles[index])
    };
}

async function getRandomMusicFile() {
    const musicFiles = await getMusicFiles();
    if (musicFiles.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * musicFiles.length);
    return {
        filename: musicFiles[randomIndex],
        index: randomIndex,
        path: path.join(musicDir, musicFiles[randomIndex])
    };
}

module.exports = {
    getMusicFiles,
    getMusicFilePath,
    getRandomMusicFile,
};
