from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class CargoResponse(BaseModel):
    id: UUID
    cargo_id: str
    weight: Decimal
    destination: str
    date: date

    class Config:
        from_attributes = True