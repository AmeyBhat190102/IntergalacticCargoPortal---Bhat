from fastapi import HTTPException, status

# ── Auth ──────────────────────────────────────────────────────────────────────

InvalidCredentialsException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid credentials.",
    headers={"WWW-Authenticate": "Bearer"},
)

TokenExpiredException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Token has expired.",
    headers={"WWW-Authenticate": "Bearer"},
)

NotAuthenticatedException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated.",
    headers={"WWW-Authenticate": "Bearer"},
)

# ── RBAC ─────────────────────────────────────────────────────────────────────

# CRITICAL: exact string required by the assessment spec — do NOT change
InsufficientClearanceException = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Clearance level inadequate.",
)

# ── Users ─────────────────────────────────────────────────────────────────────

EmailAlreadyExistsException = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="An account with this email already exists.",
)