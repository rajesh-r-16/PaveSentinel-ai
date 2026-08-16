from pydantic import BaseModel
from typing import Optional


from fastapi import Form

class ReportCreate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: str
    description: str

    @classmethod
    def as_form(
        cls,
        latitude: float = Form(...),
        longitude: float = Form(...),
        address: str = Form(...),
        description: str = Form(...)
    ):
        return cls(
            latitude=latitude,
            longitude=longitude,
            address=address,
            description=description
        )


class ReportResponse(BaseModel):

    id: int

    image: str

    latitude: float

    longitude: float

    address: str

    severity: str

    status: str

    description: str

    class Config:
        from_attributes = True