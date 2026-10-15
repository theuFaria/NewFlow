import re
import unittest
from pathlib import Path


class NavbarCartStyleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        project_root = Path(__file__).resolve().parents[2]
        cls.css = (project_root / "app" / "globals.css").read_text(encoding="utf-8")

    def rule(self, selector):
        match = re.search(
            rf"(?m)^\s*{re.escape(selector)}\s*\{{([^}}]*)\}}",
            self.css,
            re.DOTALL,
        )
        if match is None:
            self.fail(f"Missing CSS rule for {selector}")
        return match.group(1)

    def test_cart_trigger_overrides_native_button_appearance(self):
        styles = self.rule(".nav-cart")
        for declaration in (
            "appearance: none",
            "display: inline-flex",
            "align-items: center",
            "border:",
            "background:",
            "color:",
            "font:",
            "cursor: pointer",
        ):
            with self.subTest(declaration=declaration):
                self.assertIn(declaration, styles)

    def test_cart_count_is_a_compact_badge(self):
        styles = self.rule(".nav-cart-count")
        self.assertIn("display: inline-grid", styles)
        self.assertIn("border-radius: 50%", styles)
        self.assertIn("min-width:", styles)
        self.assertIn("height:", styles)


if __name__ == "__main__":
    unittest.main()
