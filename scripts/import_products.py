#!/usr/bin/env python3
"""Import GestãoClick XLSX exports into New Flow's public demo product schema.

Uses only Python's standard library. Costs, barcodes, NCM and administrative
fields are intentionally excluded from the generated JSON.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
import zipfile
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
REQUIRED_COLUMNS = {"Código", "Nome", "Valor de venda", "Estoque"}
DEMO_SIZES = ["P", "M", "G", "GG"]


def cents_from_brl(value: Any) -> int:
    """Convert an Excel/Portuguese currency value into integer cents."""
    if value is None or str(value).strip() == "":
        raise ValueError("valor monetário ausente")
    text = str(value).strip().replace("R$", "").replace(" ", "")
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    try:
        amount = Decimal(text)
    except InvalidOperation as exc:
        raise ValueError(f"valor monetário inválido: {value!r}") from exc
    if not amount.is_finite():
        raise ValueError(f"valor monetário inválido: {value!r}")
    return int((amount * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def decimal_value(value: Any, field: str) -> Decimal:
    if value is None or str(value).strip() == "":
        raise ValueError(f"{field} ausente")
    text = str(value).strip().replace(" ", "")
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    try:
        number = Decimal(text)
    except InvalidOperation as exc:
        raise ValueError(f"{field} inválido: {value!r}") from exc
    if not number.is_finite():
        raise ValueError(f"{field} inválido: {value!r}")
    return number


def _cell_text(cell: ET.Element, shared_strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.findall(f".//{{{MAIN_NS}}}t"))
    value_node = cell.find(f"{{{MAIN_NS}}}v")
    if value_node is None or value_node.text is None:
        return ""
    value = value_node.text
    if cell_type == "s":
        try:
            return shared_strings[int(value)]
        except (ValueError, IndexError) as exc:
            raise ValueError(f"índice de shared string inválido: {value}") from exc
    return value


def _column_index(cell_reference: str) -> int:
    letters = re.match(r"[A-Z]+", cell_reference.upper())
    if not letters:
        raise ValueError(f"referência de célula inválida: {cell_reference}")
    result = 0
    for char in letters.group(0):
        result = result * 26 + (ord(char) - ord("A") + 1)
    return result - 1


def read_xlsx_rows(path: str | Path) -> list[dict[str, str]]:
    """Read the first worksheet from a standard .xlsx file without dependencies."""
    workbook_path = Path(path)
    with zipfile.ZipFile(workbook_path) as archive:
        names = set(archive.namelist())
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        sheet = workbook.find(f".//{{{MAIN_NS}}}sheet")
        if sheet is None:
            raise ValueError("a planilha não contém abas")
        relation_id = sheet.attrib.get(f"{{{DOC_REL_NS}}}id")
        relation_root = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        relationship = next(
            (item for item in relation_root.findall(f"{{{PKG_REL_NS}}}Relationship")
             if item.attrib.get("Id") == relation_id),
            None,
        )
        if relationship is None:
            raise ValueError("não foi possível localizar a primeira aba")
        target = relationship.attrib.get("Target", "")
        sheet_path = target.lstrip("/") if target.startswith("/") else f"xl/{target}"
        if sheet_path not in names:
            raise ValueError(f"arquivo da aba não encontrado: {sheet_path}")

        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in names:
            shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared_strings = [
                "".join(node.text or "" for node in item.findall(f".//{{{MAIN_NS}}}t"))
                for item in shared_root.findall(f"{{{MAIN_NS}}}si")
            ]
        sheet_root = ET.fromstring(archive.read(sheet_path))
        xml_rows = sheet_root.findall(f".//{{{MAIN_NS}}}sheetData/{{{MAIN_NS}}}row")
        if not xml_rows:
            return []

        first_row: dict[int, str] = {}
        for cell in xml_rows[0].findall(f"{{{MAIN_NS}}}c"):
            first_row[_column_index(cell.attrib.get("r", ""))] = _cell_text(cell, shared_strings).strip()
        headers = [first_row.get(index, "") for index in range(max(first_row, default=-1) + 1)]
        if not headers or not any(headers):
            raise ValueError("cabeçalho da planilha ausente")
        missing = REQUIRED_COLUMNS.difference(headers)
        if missing:
            raise ValueError("colunas obrigatórias ausentes: " + ", ".join(sorted(missing)))

        result: list[dict[str, str]] = []
        for xml_row in xml_rows[1:]:
            cells: dict[int, str] = {}
            for cell in xml_row.findall(f"{{{MAIN_NS}}}c"):
                cells[_column_index(cell.attrib.get("r", ""))] = _cell_text(cell, shared_strings)
            values = {header: cells.get(index, "") for index, header in enumerate(headers) if header}
            if any(str(value).strip() for value in values.values()):
                result.append(values)
        return result


def _code(value: Any) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    if re.fullmatch(r"\d+\.0+", text):
        text = text.split(".", 1)[0]
    return text


def parse_source_variants(name: str) -> dict[str, Any]:
    size_match = re.search(r"\bT\s*:\s*([^;]+?)(?=\s*;|$)", name, re.IGNORECASE)
    color_match = re.search(r"\bCOR\s*:\s*([^;]+?)(?=\s*;|$)", name, re.IGNORECASE)
    explicit_sizes = [value.strip().upper() for value in size_match.group(1).split(",") if value.strip()] if size_match else []
    explicit_colors = [value.strip().upper() for value in color_match.group(1).split(",") if value.strip()] if color_match else []
    return {
        "sizes": explicit_sizes or list(DEMO_SIZES),
        "sizesSource": "name" if explicit_sizes else "demo",
        "colors": explicit_colors,
        "colorsSource": "name" if explicit_colors else "none",
    }


def _slugify(value: str) -> str:
    ascii_value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value.lower()).strip("-")
    return slug or "produto"


def _category(name: str) -> str:
    normalized = name.upper().replace(" ", "")
    if "BABYDOLL" in normalized:
        return "Moda íntima"
    if "BERMUDA" in normalized:
        return "Fitness"
    return "Moda feminina"


def _number_for_json(value: Decimal) -> int | float:
    return int(value) if value == value.to_integral_value() else float(value)


def normalize_product(row: dict[str, Any]) -> dict[str, Any]:
    sku = _code(row.get("Código"))
    name = str(row.get("Nome") or "").strip()
    if not sku:
        raise ValueError("código ausente")
    if not name:
        raise ValueError(f"nome ausente para o código {sku}")
    price = cents_from_brl(row.get("Valor de venda"))
    stock_decimal = decimal_value(row.get("Estoque"), "estoque")
    stock = _number_for_json(stock_decimal)
    variants = parse_source_variants(name)
    image_sku = re.sub(r"[^A-Za-z0-9_-]", "", sku)
    return {
        "id": sku,
        "sku": sku,
        "name": name,
        "slug": f"{_slugify(name)}-{_slugify(sku)}",
        "description": None,
        "priceInCents": price,
        "stock": stock,
        "images": [f"/images/products/{image_sku}.webp"],
        "category": _category(name),
        **variants,
        "isAvailable": stock_decimal > 0,
        "isDemo": True,
    }


def select_demo_products(rows: list[dict[str, Any]], limit: int = 20) -> list[dict[str, Any]]:
    if limit < 1:
        raise ValueError("o limite deve ser maior que zero")
    seen: set[str] = set()
    for row in rows:
        sku = _code(row.get("Código"))
        if sku and sku in seen:
            raise ValueError(f"código duplicado: {sku}")
        if sku:
            seen.add(sku)
    ranked: list[tuple[int, dict[str, Any], Decimal]] = []
    for index, row in enumerate(rows):
        if not _code(row.get("Código")):
            raise ValueError(f"código ausente na linha de dados {index + 2}")
        ranked.append((index, row, decimal_value(row.get("Estoque"), "estoque")))
    chosen = [item for item in ranked if item[2] > 0][:limit]
    if len(chosen) < limit:
        chosen_indexes = {item[0] for item in chosen}
        remaining = [item for item in ranked if item[0] not in chosen_indexes]
        chosen.extend(remaining[:limit - len(chosen)])
    chosen_indexes = {item[0] for item in chosen}
    return [row for index, row, _ in ranked if index in chosen_indexes]


def _merge_existing_metadata(product: dict[str, Any], previous: dict[str, Any] | None) -> dict[str, Any]:
    if not previous:
        return product
    for key in ("images", "description", "category", "sizes", "sizesSource", "colors", "colorsSource"):
        if key in previous:
            product[key] = previous[key]
    return product


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="arquivo XLSX exportado do GestãoClick")
    parser.add_argument("--out", type=Path, required=True, help="destino do JSON normalizado")
    parser.add_argument("--limit", type=int, default=20, help="quantidade de produtos demonstrativos (padrão: 20)")
    parser.add_argument("--existing", type=Path, help="JSON anterior cujas imagens e metadados devem ser preservados")
    args = parser.parse_args(argv)

    try:
        rows = read_xlsx_rows(args.input)
        selected = select_demo_products(rows, args.limit)
    except (OSError, zipfile.BadZipFile, ET.ParseError, ValueError) as exc:
        print(f"Erro ao importar planilha: {exc}", file=sys.stderr)
        return 1

    previous_path = args.existing or (args.out if args.out.exists() else None)
    previous_by_sku: dict[str, dict[str, Any]] = {}
    if previous_path and previous_path.exists():
        try:
            previous_data = json.loads(previous_path.read_text(encoding="utf-8"))
            previous_by_sku = {item["sku"]: item for item in previous_data if isinstance(item, dict) and item.get("sku")}
        except (OSError, json.JSONDecodeError, TypeError) as exc:
            print(f"Aviso: metadados anteriores não puderam ser preservados: {exc}", file=sys.stderr)

    products: list[dict[str, Any]] = []
    errors: list[str] = []
    for index, row in enumerate(selected, start=2):
        try:
            product = normalize_product(row)
            products.append(_merge_existing_metadata(product, previous_by_sku.get(product["sku"])))
        except ValueError as exc:
            errors.append(f"linha selecionada {index}: {exc}")
    if errors:
        for message in errors:
            print(f"Aviso: {message}", file=sys.stderr)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Importados {len(products)} produtos para {args.out}")
    if len(products) != args.limit:
        print(f"Aviso: esperados {args.limit} produtos, recebidos {len(products)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
