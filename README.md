# Convertisseur Word/ODT vers Site HTML (MkDocs)

🔗 **[Voir le site de démonstration généré](https://stahe.github.io/word-odt-vers-html-janv-2026/)**

---

## 📝 Description

On se propose dans ce projet de mettre à disposition du lecteur un convertisseur Python de documents Word ou ODT vers un site statique HTML.

Lorsque le document ODT convient, le convertisseur produit un site HTML via **MkDocs** qui a l'aspect professionnel des sites produits par Pandoc.

## 🤖 Contexte de création

Ce convertisseur a été entièrement construit par l’IA **Gemini 3** (avec un abonnement pro). Il est le résultat d'itérations successives pour gérer finement la structure des documents ODT (OpenDocument Text).

## ✨ Fonctionnalités

Le script `convert.py` effectue les actions suivantes :

* **Conversion ODT vers Markdown** : Analyse le fichier `.odt` (XML) pour en extraire la structure.
* **Gestion des Titres** : Génère automatiquement la Table des Matières (TOC) et la navigation latérale.
* **Blocs de Code** : Détection automatique des langages, coloration syntaxique et **gestion précise de la numérotation des lignes** (attributs `start-value`).
* **Listes** : Support des listes à puces et numérotées avec indentation correcte.
* **Mise en forme** : Support du *gras*, *italique*, *souligné* et du *surlignage* (avec respect des couleurs d'origine).
* **Images** : Extraction et intégration automatique des images contenues dans le document.
* **Configuration** : Personnalisation via un fichier `config.json` (Bas de page, Google Analytics, etc.).

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
* `config.json` : Votre fichier de configuration.
* `votre-document.odt` : Le document source.

## 💻 Utilisation

1. **Conversion**
Lancez le script en indiquant le fichier ODT source et le fichier de configuration :
```bash
python convert.py votre-document.odt config.json

```


*Cela va générer un dossier `docs/` contenant les fichiers Markdown et un fichier `mkdocs.yml`.*
2. **Prévisualisation**
Pour voir le site en local :
```bash
mkdocs serve

```


3. **Génération**
Pour construire le site statique (dossier `site/`) :
```bash
mkdocs build

```



## ⚙️ Configuration (`config.json`)

Le fichier `config.json` permet de contrôler l'apparence du site :

* **mkdocs** : Paramètres généraux du site (titre, description, thème Material).
* **footer** : Code HTML complet pour personnaliser le pied de page.
* **code** : Règles de détection des langages pour la coloration syntaxique.
* **extra** : Configuration de Google Analytics (GA4).

## 📄 Licence

Ce cours tutoriel écrit par **Serge Tahé** est mis à disposition du public selon les termes de la :
*Licence Creative Commons Attribution – Pas d’Utilisation Commerciale – Partage dans les Mêmes Conditions 3.0 non transposé.*
