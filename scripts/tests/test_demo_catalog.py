from __future__ import annotations

import json
import unittest
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
PRODUCTS = json.loads((PROJECT_ROOT / "data" / "products.demo.json").read_text(encoding="utf-8"))


class DemoCatalogTests(unittest.TestCase):
    def test_demo_catalog_has_twenty_distinct_public_records(self) -> None:
        self.assertEqual(len(PRODUCTS), 20)
        ids = [product["id"] for product in PRODUCTS]
        self.assertEqual(len(set(ids)), 20)
        for product in PRODUCTS:
            self.assertEqual(product["sku"], product["id"])
            self.assertIsInstance(product["priceInCents"], int)
            self.assertGreater(product["priceInCents"], 0)
            self.assertNotIn("cost", product)
            self.assertNotIn("barcode", product)
            self.assertNotIn("ncm", product)
            self.assertNotIn("registeredAt", product)

    def test_every_catalog_image_exists_as_optimized_webp(self) -> None:
        for product in PRODUCTS:
            self.assertEqual(len(product["images"]), 1)
            image_path = PROJECT_ROOT / "public" / product["images"][0].lstrip("/")
            self.assertTrue(image_path.is_file(), f"imagem ausente: {image_path}")
            self.assertGreater(image_path.stat().st_size, 0)

    def test_availability_is_derived_from_exported_stock(self) -> None:
        for product in PRODUCTS:
            self.assertEqual(product["isAvailable"], product["stock"] > 0)
        self.assertEqual(sum(product["isAvailable"] for product in PRODUCTS), 12)


if __name__ == "__main__":
    unittest.main()
