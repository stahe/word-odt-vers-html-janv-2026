# Convertisseur Word/ODT vers Site HTML (MkDocs)

🔗 **[Voir le site de démonstration généré](https://stahe.github.io/word-odt-vers-html-janv-2026/)**

---

## 📝 Description

On se propose dans ce projet de mettre à disposition du lecteur un convertisseur Python de documents Word ou ODT vers un site statique HTML.

Lorsque le document ODT ou DOCX convient, le convertisseur produit un site HTML via **MkDocs** de très bonne qualité.

## 🤖 Contexte de création

Ce convertisseur a été initialement construit par l’IA **Gemini 3**. Il est le résultat d'itérations successives pour gérer finement la structure des documents ODT (OpenDocument Text).
Il a été amélioré ensuite par l'IA **ChatGPT 5.2** qui a produit le convertisseur pour les documents Word.

## ✨ Fonctionnalités

Le script `convert.py` effectue les actions suivantes :

* **Conversion ODT / DOCX vers Markdown** : Analyse le fichier source pour en extraire la structure.
* **Gestion des Titres** : Génère automatiquement la Table des Matières (TOC) et la navigation latérale.
* **Blocs de Code** : Détection automatique des langages, coloration syntaxique et **gestion précise de la numérotation des lignes** (attributs `start-value`).
* **Listes** : Support des listes à puces et numérotées imbriquées et mixtes avec indentation correcte.
* **Mise en forme** : Support du *gras*, *italique*, *souligné* et du *surlignage* (avec respect des couleurs d'origine).
* **Images** : Extraction et intégration automatique des images contenues dans le document.
* **Liens** : Les hyperliens ou renvois du document source donnent lieu à des hyperliens dans le document HTML.
* **Bas de page** : Les notes de bas de page sont gérées.
* **Configuration** : Personnalisation via un fichier `config.py` (Bas de page, Google Analytics, etc.).

## 🚀 Installation

### Prérequis

* Python 3.x
* Les bibliothèques suivantes :

```bash
pip install odfpy unidecode mkdocs mkdocs-material

```

### Structure du projet

Assurez-vous d'avoir les fichiers suivants :

* `convert.py` : Le script de conversion.
* `config.py` : Votre fichier de configuration.
* `votre-document.odt/docx` : Le document source.

## 💻 Utilisation

1. **Conversion**
Lancez le script en indiquant le fichier ODT / DOCX source et le fichier de configuration :
```bash
python convert_odt_v356.py votre-document.odt config.py
python convert_docx_v18.py votre-document.docx config.py
```


*Cela va générer un dossier `docs/` contenant les fichiers Markdown et un fichier `mkdocs.yml`.*
2. **Prévisualisation**
Pour voir le site en local :
```bash
python -m mkdocs serve

```


3. **Génération**
Pour construire le site statique (dossier `site/`) :
```bash
python build

```



## ⚙️ Configuration (`config.py`)

Le fichier `config.py` permet de contrôler l'apparence du site :

* **mkdocs** : Paramètres généraux du site (titre, description, thème Material).
* **footer** : Code HTML complet pour personnaliser le pied de page.
* **code** : Règles de détection des langages pour la coloration syntaxique.
* **extra** : Configuration de Google Analytics (GA4).

## 📄 Licence

Ce cours tutoriel écrit par **Serge Tahé** est mis à disposition du public selon les termes de la :
*Licence Creative Commons Attribution – Pas d’Utilisation Commerciale – Partage dans les Mêmes Conditions 3.0 non transposé.*
