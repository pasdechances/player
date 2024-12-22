import os
import subprocess
import argparse

# Fonction pour télécharger une vidéo YouTube en MP3
def download_audio_with_ytdlp(url, download_folder):
    """
    Télécharge une vidéo YouTube en MP3 en utilisant yt-dlp.

    Args:
        url (str): L'URL de la vidéo ou playlist YouTube.
        download_folder (str): Le dossier de destination pour les fichiers MP3.
    """
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    try:
        # Commande yt-dlp pour télécharger et convertir en MP3
        command = [
            "yt-dlp",
            "--extract-audio",  # Extraire uniquement l'audio
            "--audio-format", "mp3",  # Convertir en MP3
            "--audio-quality", "0",  # Qualité audio maximale
            "--output", os.path.join(download_folder, "%(title)s.%(ext)s"),  # Format du nom de fichier
            url,
        ]
        subprocess.run(command, check=True)
        print(f"Téléchargé avec succès : {url}")
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors du téléchargement de {url} : {e}")
    except FileNotFoundError:
        print("Erreur : yt-dlp n'est pas installé ou n'est pas dans le PATH.")
        print("Installez yt-dlp avec : pip install yt-dlp")

# Fonction principale
def main(playlist_url, download_folder):
    """
    Lance le téléchargement d'une playlist ou vidéo YouTube en MP3.

    Args:
        playlist_url (str): L'URL de la playlist ou vidéo YouTube.
        download_folder (str): Le dossier de destination pour les fichiers MP3.
    """
    if not playlist_url:
        print("Erreur : Veuillez fournir une URL valide pour la playlist ou la vidéo YouTube.")
        return

    print(f"Début du téléchargement depuis : {playlist_url}")
    print(f"Fichiers MP3 enregistrés dans : {download_folder}")
    download_audio_with_ytdlp(playlist_url, download_folder)

# Point d'entrée du script
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Télécharge les musiques depuis une playlist YouTube en MP3.")
    parser.add_argument("-p", "--playlist_url", type=str, required=True, help="URL de la playlist ou vidéo YouTube.")
    parser.add_argument("-d", "--directory", type=str, help="Dossier de destination pour les fichiers MP3", default="musics")

    args = parser.parse_args()

    main(playlist_url=args.playlist_url, download_folder=args.directory)
