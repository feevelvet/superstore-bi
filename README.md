# Superstore BI Dashboard

Dashboard d'analyse des données Superstore avec visualisation des KPI clés.

## Description

Projet pour analyser et visualiser les données de ventes du dataset Superstore. Le dashboard permet de voir les performances par catégorie, région, et leurs évolutions dans le temps.

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

- Analyse du CA par catégorie et région
- Performance des produits
- Évolution des ventes dans le temps
- Statistiques clients
- Marges et profitabilité

## 🚀 Installation & Démarrage

### 1️⃣ Prérequis
- Python 3.8+
- pip installé
- Docker (optionnel pour déploiement)

### 2️⃣ Installation des dépendances
```bash
# Cloner le repo
git clone https://github.com/feevelvet/superstore-bi.git
cd superstore-bi

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate  # Windows

# Installer les dépendances
pipInstallation

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

Lancer le dashboard:
```bash
streamlit run frontend/dashboard.py
docker-compose up
```

## 🎨 Fonctionnalités Clés

### Filtres Interactifs
- 📅 Plage de dates
- 📦 Catégorie de produits
- 🌍 Région géographique
- 👥 Segment client

### Storytelling & Insights
- 💡 Insights automatiques par section
- 📈 Détection de tendances
- ⚠️ Alertes et recommandations
- 📊 Points d'attention identifiés

### Visualisations Plotly
- Graphiques interactifs et responsifs
- Hover pour détails
- Téléchargement d'images
- Zoom et pan

## 📈 Améliorations Apportées

### Par rapport à la version initiale :

#### 1. **Storytelling Ajouté**
```python
# Insights automatiques basés sur les données
- Alertes marge (saine ou à risque)
- Détection tendances temporelles (hausse/baisse/stabilité)
- Identification opportunités géographiques
- Analyse taux de fidélisation
```

#### 2. **KPI Enrichis**
```python
# Au lieu de juste afficher les chiffres
ca_total = 1,000,000 €  ❌ Peu informatif

# Avec storytelling
Performance CA : 1,000,000 € ✅
├─ 💡 Insight : Croissance de 15% vs période précédente
├─ 🎯 Recommandation : Maintenir le momentum
└─ ⚠️ Alerte : Profiter des pics saisonniers
```

#### 3. **Recommandations Contextuelles**
- Chaque section offre des actions recommandées
- Basées sur l'analyse des données
- Orientées vers la prise de décision

#### 4. **Structure Logique**
- Flux de lecture clair (du global au détail)
- Sections bien équilibrées
- Chaque graphique répond à une question métier

## 🔧 Utilisation de l'API

### Exemples de Requêtes

#### KPI Globaux
```bash
# Sans filtre
curl http://localhost:8000/kpi/globaux

# Avec filtres
curl "http://localhost:8000/kpi/globaux?date_debut=2015-01-01&categorie=Technology"
```

#### Top Produits
```bash
curl "http://localhost:8000/kpi/produits/top?limite=5&tri_par=profit"
```

#### Catégories
```bash
curl http://localhost:8000/kpi/categories
```

#### Évolution Temporelle
```bash
curl "http://localhost:8000/kpi/temporel?periode=mois"
```

#### Performance Géographique
```bash
curl http://localhost:8000/kpi/geographique
```

#### Analyse Clients
```bash
curl "http://localhost:8000/kpi/clients?limite=10"
```

## 📖 Documentation API

La documentation complète de l'API est disponible à :
- **Swagger** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

## 🧪 Tests

```bash
cd tests
pytest test_api.py -v
```

## 🛠️ Stack Technologique

### Backend
- **FastAPI** : Framework web moderne et rapide
- **Pandas** : Manipulation de données
- **Pydantic** : Validation des modèles

### Frontend
- **Streamlit** : Framework pour dashboards interactifs
- **Plotly** : Visualisations interactives
- **Requests** : Appels HTTP vers l'API

### Infrastructure
- **Docker** : Conteneurisation
- **Docker Compose** : Orchestration multi-conteneurs

## 📊 Dataset

**Sample Superstore** - Données e-commerce réelles
- **Période** : 2014-2017 (~10,000 lignes)
- **Colonnes** : Order ID, Customer ID, Product Name, Category, Sales, Profit, Region, etc.
- **Source** : https://github.com/leonism/sample-superstore

## 🎓 Points Clés d'Apprentissage

### Pour les Étudiants
1. **Data Profiling** : Comprendre avant d'exploiter
2. **Data Quality** : Fiabilité des indicateurs
3. **Reporting** : Synthèse orientée métier
4. **Data Visualization** : Rendre compréhensible
5. **Data Storytelling** : Donner du sens aux chiffres

### Message Clé
> **"Un bon dashboard ne montre pas tout. Il montre ce qui aide à comprendre et à décider."**

## 🚢 Déploiement

### Sur Heroku
```bash
git push heroku main
```

### En Production
1. Variables d'environnement sécurisées
2. CORS restreint à vos domaines
3. Authentification sur l'API
4. Monitoring et logging

## 📝 Licence

Projet pédagogique - B3 EPSI

## 👨‍💻 Auteur

Développé dans le cadre du cours **Reporting et Data Visualization**
- **Professeur** : opinaka-attik
- **Atelier** : Enrichissement d'un dashboard avec storytelling

## 📞 Support

Pour toute question :
- 📧 Consultez votre professeur
- 🐛 Signalez les bugs via Issues
- 💡 Proposez des améliorations via Pull Requests

---

**Dernière mise à jour** : Février 2026
**Version** : 2.0 (avec Data Storytelling)
