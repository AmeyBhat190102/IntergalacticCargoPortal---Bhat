from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import InsufficientClearanceException, NotAuthenticatedException
from app.core.security import decode_access_token
from app.database import get_connection, release_connection

bearer_scheme = HTTPBearer(auto_error=False)


def get_db():
    """Yield a psycopg2 connection from the pool; always release on exit."""
    conn = get_connection()
    try:
        yield conn
    finally:
        release_connection(conn)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    conn=Depends(get_db),
) -> dict:
    """
    Decode the Bearer JWT and return the user row from DB.
    Raises 401 if token is missing, invalid, or user no longer exists.
    """
    if credentials is None:
        raise NotAuthenticatedException

    payload = decode_access_token(credentials.credentials)
    email: str | None = payload.get("sub")
    if not email:
        raise NotAuthenticatedException

    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, email, role FROM users WHERE email = %s",
            (email,),
        )
        row = cur.fetchone()

    if row is None:
        raise NotAuthenticatedException

    return {"id": row[0], "email": row[1], "role": row[2]}


def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Raises 403 with exact required message if user is not admin."""
    if current_user["role"] != "admin":
        raise InsufficientClearanceException
    return current_user