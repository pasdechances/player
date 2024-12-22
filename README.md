# player
prise en main de audiocontext

raf : mise en forme du lecteur.
travailler le nom de music envoyé
player 200px/200px

## installation

pip install yt-dlp

node + npm


## Fonctionnement de ytdl.py

Objectif : Télécharge les musiques depuis une playlist YouTube en MP3.

Prérequis : 

- ffmpeg


Arguments acceptés :

    --directory : Dossier de destination pour les fichiers MP3.
    --playlist_url : URL de la playlist ou vidéo YouTube.


## Étapes pour Installer et Configurer ffmpeg
Télécharger ffmpeg :

- Rendez-vous sur le site officiel de ffmpeg : https://ffmpeg.org/download.html.
- Cliquez sur "Windows builds by BtbN" pour obtenir une version précompilée.
- Téléchargez le fichier zip approprié (par exemple, ffmpeg-release-full.7z).

Extraire les fichiers :

- Extrayez le fichier téléchargé dans un dossier, par exemple C:\ffmpeg.

Ajouter ffmpeg au PATH :

- Ouvrez le menu Démarrer et recherchez "Variables d'environnement".
- Dans la section Variables système, trouvez et sélectionnez Path, puis cliquez sur Modifier.
- Ajoutez le chemin vers le dossier bin de ffmpeg, par exemple :

    C:\ffmpeg\bin

Vérifiez l'installation :

Ouvrez une invite de commande et tapez :

    ffmpeg -version

Si ffmpeg est correctement installé, vous verrez des informations sur la version.
