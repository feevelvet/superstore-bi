"""
Tests unitaires pour l'API FastAPI Superstore BI
Utilise pytest et httpx pour tester les endpoints
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ajouter le chemin du backend au sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app, load_data

# Client de test FastAPI
client = TestClient(app)


class TestRootEndpoint:
    """Tests pour l'endpoint racine"""
    
    def test_root_returns_200(self):
        """Test que l'endpoint racine retourne un status 200"""
        response = client.get("/")
        assert response.status_code == 200
    
    def test_root_returns_api_info(self):
        """Test que l'endpoint racine retourne les informations de l'API"""
        response = client.get("/")
        data = response.json()
        
        assert "message" in data
        assert "version" in data
        assert data["version"] == "1.0.0"
        assert "dataset" in data
        assert data["dataset"] == "Sample Superstore"
    
    def test_root_has_endpoints_list(self):
        """Test que l'endpoint racine liste tous les endpoints disponibles"""
        response = client.get("/")
        data = response.json()
        
        assert "endpoints" in data
        assert "documentation" in data["endpoints"]
        assert "kpi_globaux" in data["endpoints"]


class TestKPIGlobaux:
    """Tests pour l'endpoint KPI Globaux"""
    
    def test_kpi_globaux_returns_200(self):
        """Test que l'endpoint KPI globaux retourne un status 200"""
        response = client.get("/kpi/globaux")
        assert response.status_code == 200
    
    def test_kpi_globaux_has_required_fields(self):
        """Test que la réponse contient tous les champs requis"""
        response = client.get("/kpi/globaux")
        data = response.json()
        
        required_fields = [
            "ca_total",
            "nb_commandes",
            "nb_clients",
            "panier_moyen",
            "quantite_vendue",
            "profit_total",
            "marge_moyenne"
        ]
        
        for field in required_fields:
            assert field in data, f"Champ manquant: {field}"
    
    def test_kpi_globaux_values_are_positive(self):
        """Test que les valeurs KPI sont positives"""
        response = client.get("/kpi/globaux")
        data = response.json()
        
        assert data["ca_total"] > 0
        assert data["nb_commandes"] > 0
        assert data["nb_clients"] > 0
        assert data["panier_moyen"] > 0
        assert data["quantite_vendue"] > 0
        assert data["profit_total"] > 0
    
    def test_kpi_globaux_panier_moyen_calculation(self):
        """Test que le panier moyen est calculé correctement"""
        response = client.get("/kpi/globaux")
        data = response.json()
        
        # panier_moyen doit être égal à ca_total / nb_commandes
        expected_panier = round(data["ca_total"] / data["nb_commandes"], 2)
        assert expected_panier == data["panier_moyen"]
    
    def test_kpi_globaux_with_filters(self):
        """Test l'endpoint KPI avec des filtres"""
        response = client.get("/kpi/globaux?categorie=Technology")
        assert response.status_code == 200
        
        data = response.json()
        assert data["ca_total"] > 0
    
    def test_kpi_globaux_marge_percentage(self):
        """Test que la marge est entre 0 et 100%"""
        response = client.get("/kpi/globaux")
        data = response.json()
        
        assert 0 <= data["marge_moyenne"] <= 100


class TestTopProduits:
    """Tests pour l'endpoint Top Produits"""
    
    def test_top_produits_returns_200(self):
        """Test que l'endpoint retourne un status 200"""
        response = client.get("/kpi/produits/top")
        assert response.status_code == 200
    
    def test_top_produits_returns_list(self):
        """Test que la réponse est une liste"""
        response = client.get("/kpi/produits/top")
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_top_produits_default_limite(self):
        """Test que la limite par défaut est 10"""
        response = client.get("/kpi/produits/top")
        data = response.json()
        
        assert len(data) <= 10
    
    def test_top_produits_with_limite(self):
        """Test que le paramètre limite fonctionne"""
        response = client.get("/kpi/produits/top?limite=5")
        data = response.json()
        
        assert len(data) <= 5
    
    def test_top_produits_required_fields(self):
        """Test que chaque produit a les champs requis"""
        response = client.get("/kpi/produits/top?limite=3")
        data = response.json()
        
        required_fields = ["produit", "categorie", "ca", "quantite", "profit"]
        
        for produit in data:
            for field in required_fields:
                assert field in produit
    
    def test_top_produits_tri_par_ca(self):
        """Test le tri par CA"""
        response = client.get("/kpi/produits/top?tri_par=ca&limite=3")
        data = response.json()
        
        # Vérifier que c'est trié en ordre décroissant
        for i in range(len(data) - 1):
            assert data[i]["ca"] >= data[i + 1]["ca"]
    
    def test_top_produits_tri_par_profit(self):
        """Test le tri par profit"""
        response = client.get("/kpi/produits/top?tri_par=profit&limite=3")
        data = response.json()
        
        # Vérifier que c'est trié en ordre décroissant
        for i in range(len(data) - 1):
            assert data[i]["profit"] >= data[i + 1]["profit"]
    
    def test_top_produits_tri_par_quantite(self):
        """Test le tri par quantité"""
        response = client.get("/kpi/produits/top?tri_par=quantite&limite=3")
        data = response.json()
        
        # Vérifier que c'est trié en ordre décroissant
        for i in range(len(data) - 1):
            assert data[i]["quantite"] >= data[i + 1]["quantite"]


class TestCategories:
    """Tests pour l'endpoint Catégories"""
    
    def test_categories_returns_200(self):
        """Test que l'endpoint retourne un status 200"""
        response = client.get("/kpi/categories")
        assert response.status_code == 200
    
    def test_categories_returns_list(self):
        """Test que la réponse est une liste"""
        response = client.get("/kpi/categories")
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_categories_has_required_fields(self):
        """Test que chaque catégorie a les champs requis"""
        response = client.get("/kpi/categories")
        data = response.json()
        
        required_fields = ["categorie", "ca", "profit", "nb_commandes", "marge_pct"]
        
        for cat in data:
            for field in required_fields:
                assert field in cat
    
    def test_categories_marge_calculation(self):
        """Test que la marge est calculée correctement"""
        response = client.get("/kpi/categories")
        data = response.json()
        
        for cat in data:
            expected_marge = round(cat["profit"] / cat["ca"] * 100, 2)
            assert expected_marge == cat["marge_pct"]


class TestEvolutionTemporelle:
    """Tests pour l'endpoint Evolution Temporelle"""
    
    def test_temporel_returns_200(self):
        """Test que l'endpoint retourne un status 200"""
        response = client.get("/kpi/temporel")
        assert response.status_code == 200
    
    def test_temporel_returns_list(self):
        """Test que la réponse est une liste"""
        response = client.get("/kpi/temporel")
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_temporel_par_mois(self):
        """Test l'évolution par mois"""
        response = client.get("/kpi/temporel?periode=mois")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
    
    def test_temporel_par_annee(self):
        """Test l'évolution par année"""
        response = client.get("/kpi/temporel?periode=annee")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
    
    def test_temporel_par_jour(self):
        """Test l'évolution par jour"""
        response = client.get("/kpi/temporel?periode=jour")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)


class TestGeographique:
    """Tests pour l'endpoint Performance Géographique"""
    
    def test_geographique_returns_200(self):
        """Test que l'endpoint retourne un status 200"""
        response = client.get("/kpi/geographique")
        assert response.status_code == 200
    
    def test_geographique_returns_list(self):
        """Test que la réponse est une liste"""
        response = client.get("/kpi/geographique")
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_geographique_has_regions(self):
        """Test que les données géographiques contiennent des régions"""
        response = client.get("/kpi/geographique")
        data = response.json()
        
        # Au minimum East, West, South, Central
        regions = [item.get("region") for item in data]
        assert len(set(regions)) >= 2  # Au moins 2 régions différentes


class TestClients:
    """Tests pour l'endpoint Analyse Clients"""
    
    def test_clients_returns_200(self):
        """Test que l'endpoint retourne un status 200"""
        response = client.get("/kpi/clients")
        assert response.status_code == 200
    
    def test_clients_returns_dict(self):
        """Test que la réponse est un dictionnaire"""
        response = client.get("/kpi/clients")
        data = response.json()
        
        assert isinstance(data, dict)
        assert "top_clients" in data or "recurrence" in data
    
    def test_clients_with_limite(self):
        """Test que le paramètre limite fonctionne"""
        response = client.get("/kpi/clients?limite=5")
        data = response.json()
        
        assert isinstance(data, dict)


class TestRemises:
    """Tests pour l'endpoint Analyse des Remises"""
    
    def test_remises_returns_200(self):
        """Test que l'endpoint remises retourne un status 200"""
        response = client.get("/kpi/remises")
        assert response.status_code == 200
    
    def test_remises_has_required_fields(self):
        """Test que la réponse contient tous les champs requis"""
        response = client.get("/kpi/remises")
        data = response.json()
        
        required_fields = [
            "remise_totale_montant",
            "nb_commandes_avec_remise",
            "remise_moyenne_pct",
            "profit_perdu_estimation",
            "pourcentage_commandes_remisees",
            "top_produits_remises"
        ]
        
        for field in required_fields:
            assert field in data, f"Champ manquant: {field}"
    
    def test_remises_pourcentage_between_0_100(self):
        """Test que les pourcentages sont entre 0 et 100"""
        response = client.get("/kpi/remises")
        data = response.json()
        
        assert 0 <= data["remise_moyenne_pct"] <= 100
        assert 0 <= data["pourcentage_commandes_remisees"] <= 100
    
    def test_remises_top_produits_is_list(self):
        """Test que top_produits_remises est une liste"""
        response = client.get("/kpi/remises")
        data = response.json()
        
        assert isinstance(data["top_produits_remises"], list)
    
    def test_remises_top_produits_fields(self):
        """Test que chaque produit remisé a les champs requis"""
        response = client.get("/kpi/remises")
        data = response.json()
        
        required_fields = ["produit", "remise_moyenne_pct", "ca", "profit", "nb_commandes"]
        
        for produit in data["top_produits_remises"]:
            for field in required_fields:
                assert field in produit, f"Champ manquant: {field}"
    
    def test_remises_values_are_positive_or_zero(self):
        """Test que les valeurs sont positives ou zéro"""
        response = client.get("/kpi/remises")
        data = response.json()
        
        assert data["remise_totale_montant"] >= 0
        assert data["nb_commandes_avec_remise"] >= 0
        assert data["remise_moyenne_pct"] >= 0
        assert data["profit_perdu_estimation"] >= 0


class TestFiltres:
    """Tests pour l'endpoint Filtres"""
    
    def test_filtres_valeurs_returns_200(self):
        """Test que l'endpoint filtres retourne un status 200"""
        response = client.get("/filters/valeurs")
        assert response.status_code == 200
    
    def test_filtres_valeurs_has_categories(self):
        """Test que les valeurs de filtres contiennent les catégories"""
        response = client.get("/filters/valeurs")
        data = response.json()
        
        assert "categories" in data
        assert len(data["categories"]) > 0
    
    def test_filtres_valeurs_has_regions(self):
        """Test que les valeurs de filtres contiennent les régions"""
        response = client.get("/filters/valeurs")
        data = response.json()
        
        assert "regions" in data
        assert len(data["regions"]) > 0


class TestDataLoading:
    """Tests pour le chargement des données"""
    
    def test_load_data_returns_dataframe(self):
        """Test que load_data retourne un dataframe"""
        df = load_data()
        assert df is not None
        assert len(df) > 0
    
    def test_loaded_data_has_required_columns(self):
        """Test que le dataframe a les colonnes requises"""
        df = load_data()
        
        required_columns = [
            "Order ID", "Order Date", "Customer ID", 
            "Product Name", "Category", "Sales", "Quantity", "Profit"
        ]
        
        for col in required_columns:
            assert col in df.columns


class TestErrorHandling:
    """Tests pour la gestion des erreurs"""
    
    def test_invalid_periode_returns_error(self):
        """Test qu'une période invalide retourne une erreur"""
        response = client.get("/kpi/temporel?periode=invalid")
        assert response.status_code == 422  # Validation error
    
    def test_invalid_tri_par_returns_error(self):
        """Test qu'un tri_par invalide retourne une erreur"""
        response = client.get("/kpi/produits/top?tri_par=invalid")
        assert response.status_code == 422  # Validation error
    
    def test_limite_out_of_range_returns_error(self):
        """Test qu'une limite invalide retourne une erreur"""
        response = client.get("/kpi/produits/top?limite=100")
        assert response.status_code == 422  # Validation error (max 50)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
