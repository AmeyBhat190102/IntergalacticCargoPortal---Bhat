from fastapi import APIRouter, Depends, File, UploadFile

from app.core.dependencies import get_current_user, get_db, require_admin
from app.schemas.cargo import CargoResponse
from app.services.manifest_service import parse_and_save_manifest

router = APIRouter(tags=["Cargo"])


@router.post("/upload", status_code=200)
def upload_manifest(
    file: UploadFile = File(...),
    conn=Depends(get_db),
    _admin=Depends(require_admin),  # raises 403 "Clearance level inadequate." for non-admins
):
    """
    Admin-only. Parses manifest.txt, applies Sector-7 multiplier,
    filters prime weights, and saves surviving records to DB.
    """
    file_bytes = file.file.read()
    result = parse_and_save_manifest(conn, file_bytes)
    return result


@router.get("/cargo", response_model=list[CargoResponse])
def get_cargo(
    conn=Depends(get_db),
    _user=Depends(get_current_user),  # any authenticated user
):
    """
    Returns all saved cargo records in KG.
    Frontend handles KG → LBS conversion for Standard users.
    """
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, cargo_id, weight, destination, date FROM cargo ORDER BY id"
        )
        rows = cur.fetchall()

    return [
        {
            "id": row[0],
            "cargo_id": row[1],
            "weight": row[2],
            "destination": row[3],
            "date": row[4],
        }
        for row in rows
    ]