import os
import re
from pytube import YouTube

# Dossier de destination
download_folder = "musics"
list_folder = "list/list.txt"

# Fonction pour formater le titre de la vidéo
def format_filename(title, ext):
    title = re.sub(r'[^\w\s-]', '', title)
    title = title.replace(' ', '_')
    max_length = 255 - len(ext) - 1 
    title = title[:max_length]
    return f"{title}.{ext}"

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
            ext = stream.mime_type.split('/')[-1]
            formatted_title = format_filename(yt.title, ext)
            file_path = os.path.join(download_folder, formatted_title)
            if os.path.exists(file_path):
                print(f'Le fichier existe déjà: {formatted_title}')
                continue
            
            stream.download(output_path=download_folder, filename=formatted_title)
            print(f'Téléchargé: {formatted_title}')
        except Exception as e:
            print(f'Erreur lors du téléchargement de {url.strip()}: {e}')

main(download_folder, list_folder)