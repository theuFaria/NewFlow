from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from import_products import cents_from_brl, normalize_product, parse_source_variants, select_demo_products


class ImportProductsTests(unittest.TestCase):
    def test_converts_brazilian_currency_to_integer_cents(self) -> None:
        self.assertEqual(cents_from_brl("219,90"), 21990)
        self.assertEqual(cents_from_brl("1.234,56"), 123456)
        self.assertEqual(cents_from_brl(49.99), 4999)

    def test_negative_stock_is_unavailable_and_cost_is_not_public(self) -> None:
        product = normalize_product({
            "Código": "58120001",
            "Nome": "BERMUDA AMAZ. LONG 080432 PLIE",
            "Valor de custo": "99,90",
            "Valor de venda": "219,90",
            "Estoque": "-2,00",
        })
        self.assertFalse(product["isAvailable"])
        self.assertEqual(product["priceInCents"], 21990)
        self.assertNotIn("cost", product)
        self.assertNotIn("barcode", product)
        self.assertEqual(product["stock"], -2)

    def test_only_explicit_size_and_color_are_marked_as_source_data(self) -> None:
        explicit = parse_source_variants("BERMUDA COM BOLSO T: G1; COR: FUCSIA")
        self.assertEqual(explicit["sizes"], ["G1"])
        self.assertEqual(explicit["colors"], ["FUCSIA"])
        self.assertEqual(explicit["sizesSource"], "name")
        self.assertEqual(explicit["colorsSource"], "name")

        inferred = parse_source_variants("BERMUDA BIKER ELITE 129406")
        self.assertEqual(inferred["sizes"], ["P", "M", "G", "GG"])
        self.assertEqual(inferred["sizesSource"], "demo")
        self.assertEqual(inferred["colors"], [])
        self.assertEqual(inferred["colorsSource"], "none")

    def test_selects_exact_limit_prioritizing_positive_stock(self) -> None:
        rows = [
            {"Código": str(index), "Nome": f"PRODUTO {index}", "Valor de venda": "10,00", "Estoque": str(stock)}
            for index, stock in enumerate([0, 1, -1, 2, 0, 3])
        ]
        selected = select_demo_products(rows, limit=4)
        self.assertEqual(len(selected), 4)
        self.assertEqual({row["Código"] for row in selected}, {"1", "3", "5", "0"})

    def test_duplicate_codes_are_rejected(self) -> None:
        rows = [
            {"Código": "X1", "Nome": "A", "Valor de venda": "10,00", "Estoque": "1"},
            {"Código": "X1", "Nome": "B", "Valor de venda": "10,00", "Estoque": "0"},
        ]
        with self.assertRaisesRegex(ValueError, "duplicad"):
            select_demo_products(rows, limit=2)


if __name__ == "__main__":
    unittest.main()
