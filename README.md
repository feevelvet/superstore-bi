# Superstore BI Dashboard

Dashboard pour analyser les données de ventes Superstore.

## Description

Projet de visualisation et analyse des données Superstore. Le dashboard affiche les performances par catégorie, région et dans le temps.

## Structure

```
superstore-bi/
├── backend/
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── dashboard.py
│   ├── Dockerfile
│   └── requirements.txt
├── tests/
│   └── test_api.py
└── docker-compose.yml
```

## Fonctionnalités

- Affichage du CA par catégorie et région
- Performance des produits
- Tendances des ventes
- Statistiques clients
- Analyse de la profitabilité

## Installation

Prérequis:
- Python 3.8+
- Docker (optionnel)

Installation:
```bash
git clone https://github.com/feevelvet/superstore-bi.git
cd superstore-bi

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

## Utilisation

Lancer le dashboard:
```bash
streamlit run frontend/dashboard.py
```

Ou avec Docker:
```bash
docker-compose up
```

L'application se lance sur `http://localhost:8000`

## Tests

```bash
pytest tests/
```
