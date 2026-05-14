import re
from datetime import date

import psycopg2

from app.utils.prime import is_prime

# Matches lines like: [2026-03-29] || CRG-001 :: 500 >> Mars Base Alpha
_LINE_PATTERN = re.compile(
    r"\[(.+?)\] \|\| (.+?) :: (\d+(?:\.\d+)?) >> (.+)"
)

SECTOR_7_MULTIPLIER = 1.45


def _parse_line(line: str) -> tuple | None:
    """
    Parse a single manifest line.
    Returns (date_str, cargo_id, weight_raw, destination) or None if malformed.
    """
    match = _LINE_PATTERN.match(line.strip())
    if not match:
        return None
    date_str, cargo_id, weight_raw, destination = match.groups()
    return date_str, cargo_id.strip(), float(weight_raw), destination.strip()


def _process_weight(weight: float, destination: str) -> int | None:
    """
    Apply Sector-7 multiplier if applicable, round, then prime-check.
    Returns the final integer weight, or None if the record must be discarded.
    """
    # Step 1: Sector-7 multiplier — case-sensitive match
    if "Sector-7" in destination:
        weight = weight * SECTOR_7_MULTIPLIER

    # Step 2: Round to nearest whole number
    weight = round(weight)

    # Step 3: If prime → discard
    if is_prime(weight):
        return None

    return weight


def parse_and_save_manifest(conn, file_bytes: bytes) -> dict:
    """
    Full pipeline: parse manifest bytes → transform → filter → bulk insert.
    Returns a summary of processed, saved, and skipped records.
    """
    lines = file_bytes.decode("utf-8").splitlines()

    to_insert = []
    skipped = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        parsed = _parse_line(line)
        if parsed is None:
            continue

        date_str, cargo_id, weight_raw, destination = parsed

        final_weight = _process_weight(weight_raw, destination)

        if final_weight is None:
            skipped.append(cargo_id)
            continue

        to_insert.append((cargo_id, final_weight, destination, date_str))

    saved = _bulk_insert_cargo(conn, to_insert)

    return {
        "processed": len(lines),
        "saved": saved,
        "skipped_prime": skipped,
    }


def _bulk_insert_cargo(conn, records: list[tuple]) -> int:
    """
    Insert cargo records. Skips duplicates on cargo_id conflict (idempotent re-upload).
    Returns number of rows actually inserted.
    """
    if not records:
        return 0

    inserted = 0
    with conn.cursor() as cur:
        for cargo_id, weight, destination, date_str in records:
            try:
                cur.execute(
                    """
                    INSERT INTO cargo (cargo_id, weight, destination, date)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (cargo_id) DO NOTHING
                    """,
                    (cargo_id, weight, destination, date_str),
                )
                if cur.rowcount == 1:
                    inserted += 1
            except psycopg2.Error:
                conn.rollback()
                raise
        conn.commit()

    return inserted