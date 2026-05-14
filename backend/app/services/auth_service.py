import psycopg2

from app.core.exceptions import EmailAlreadyExistsException, InvalidCredentialsException
from app.core.security import create_access_token, hash_password, verify_password


def provision_role(email: str) -> str:
    """
    Assign role based on email domain.
    Exactly @nebula-corp.com → admin. All others → standard.
    """
    if email.endswith("@nebula-corp.com"):
        return "Admin"
    return "Standard"


def create_user(conn, email: str, password: str) -> dict:
    """
    Hash password, provision role, insert user.
    Raises 400 if email already exists.
    """
    role = provision_role(email)
    hashed = hash_password(password)

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (email, password, role)
                VALUES (%s, %s, %s)
                RETURNING id, email, role
                """,
                (email, hashed, role),
            )
            row = cur.fetchone()
            conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise EmailAlreadyExistsException

    return {"id": row[0], "email": row[1], "role": row[2]}


def authenticate_user(conn, email: str, password: str) -> str:
    """
    Verify credentials and return a signed JWT.
    Raises 401 on any mismatch.
    """
    with conn.cursor() as cur:
        cur.execute(
            "SELECT password, role FROM users WHERE email = %s",
            (email,),
        )
        row = cur.fetchone()

    if row is None or not verify_password(password, row[0]):
        raise InvalidCredentialsException

    token = create_access_token({"sub": email, "role": row[1]})
    return token