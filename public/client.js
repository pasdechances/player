const audioPlayer = document.getElementById('audio-player');

        async function loadRandomMusic() {
            const response = await fetch('/random-music');
            const blob = await response.blob();
            const index = response.headers.get('X-Music-Index');
            const filename = response.headers.get('X-Music-Name');
            audioPlayer.src = URL.createObjectURL(blob);
            document.getElementById('song-name').innerHTML = filename
        }

        async function playMusic() {
            await loadRandomMusic();
            audioPlayer.play()
        }

        document.getElementById('shuffle').onclick = async () => {
            await playMusic();
        };

        audioPlayer.addEventListener('ended', async () => {
            await playMusic();
        });

        window.onload = () => {
            loadRandomMusic();
        };