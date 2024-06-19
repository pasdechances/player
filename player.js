const express = require('express');
const http = require('http');
const path = require('path');
const { getMusicFiles, getMusicFilePath, getRandomMusicFile } = require('./functions');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/music', async (req, res) => {
    const musicFiles = await getMusicFiles();
    res.json(musicFiles);
});

app.get('/music/:index', async (req, res) => {
    const index = parseInt(req.params.index, 10);
    const musicPath = await getMusicFilePath(index);
    if (!musicPath) {
        return res.status(404).send('Music file not found');
    }

    res.sendFile(musicFile.path, {
        headers: {
            'X-Music-Index': musicFile.index
        }
    });
});

app.get('/random-music', async (req, res) => {
    const musicFile = await getRandomMusicFile();
    if (!musicFile) {
        return res.status(404).send('No music file found');
    }

    res.sendFile(musicFile.path, {
        headers: {
            'X-Music-Name': musicFile.filename,
            'X-Music-Index': musicFile.index
        }
    });
});

app.get('/random-music/:current', async (req, res) => {
    const musicFile = await getRandomMusicFile();
    if (!musicFile) {
        return res.status(404).send('No music file found');
    }

    res.sendFile(musicFile.path, {
        headers: {
            'X-Music-Name': musicFile.filename,
            'X-Music-Index': musicFile.index
        }
    });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    const musicFiles = await getMusicFiles();
    if (musicFiles.length === 0) {
        console.error('No music files found to stream.');
        process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
});
