import os
from pytube import YouTube

# Dossier de destination
download_folder = "musics"
list_folder = "list/list.txt"

# Fonction pour formater le titre de la vidéo
def format_filename(title):
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        title = title.replace(char, '_')
    title = title.encode('utf-8', 'ignore').decode('utf-8')
    return title[:255]

# Fonction principale
def main(download_folder, list_folder):
    # Créer le dossier s'il n'existe pas
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    # Lire le fichier list.txt
    with open(list_folder, 'r') as file:
        urls = file.readlines()

    # Télécharger chaque vidéo
    for url in urls:
        try:
            yt = YouTube(url.strip())
            stream = yt.streams.get_highest_resolution()
            formatted_title = format_filename(yt.title)
            stream.download(output_path=download_folder, filename=formatted_title)
            print(f'Téléchargé: {formatted_title}')
        except Exception as e:
            print(f'Erreur lors du téléchargement de {url.strip()}: {e}')

main(download_folder, list_folder)