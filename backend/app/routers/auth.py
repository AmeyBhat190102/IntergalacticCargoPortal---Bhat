from fastapi import APIRouter, Depends

from app.core.dependencies import get_db
from app.schemas.user import LoginRequest, MessageResponse, SignupRequest, TokenResponse
from app.services.auth_service import authenticate_user, create_user

router = APIRouter(tags=["Auth"])


@router.post("/signup", response_model=MessageResponse, status_code=201)
def signup(payload: SignupRequest, conn=Depends(get_db)):
    create_user(conn, email=payload.email, password=payload.password)
    return {"message": "User created successfully"}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, conn=Depends(get_db)):
    token = authenticate_user(conn, email=payload.email, password=payload.password)
    return {"access_token": token, "token_type": "bearer"}