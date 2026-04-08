#!/usr/bin/env python3
"""
Script pour télécharger et sauvegarder le dataset Superstore localement
"""

import pandas as pd
import os

# URL du dataset
DATASET_URL = "https://raw.githubusercontent.com/leonism/sample-superstore/master/data/superstore.csv"
OUTPUT_PATH = "backend/data/superstore.csv"

# Créer le dossier s'il n'existe pas
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

print("Téléchargement du dataset...")
try:
    df = pd.read_csv(DATASET_URL, encoding='latin-1')
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"✅ Dataset sauvegardé dans {OUTPUT_PATH}")
    print(f"📊 {len(df)} lignes chargées")
except Exception as e:
    print(f"❌ Erreur: {e}")
