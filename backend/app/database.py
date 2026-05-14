import logging
from psycopg2 import pool, OperationalError
from app.config import settings

logger = logging.getLogger(__name__)

_connection_pool: pool.SimpleConnectionPool | None = None


def init_db_pool() -> None:
    """
    Initialize the psycopg2 SimpleConnectionPool.
    Called once on application startup.
    """
    global _connection_pool
    try:
        _connection_pool = pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=settings.DATABASE_URL,
        )
        logger.info("Database connection pool initialized.")
    except OperationalError as e:
        logger.error(f"Failed to initialize database pool: {e}")
        raise


def get_connection():
    """Pull a connection from the pool."""
    if _connection_pool is None:
        raise RuntimeError("Database pool is not initialized. Call init_db_pool() first.")
    return _connection_pool.getconn()


def release_connection(conn) -> None:
    """Return a connection back to the pool."""
    if _connection_pool is not None:
        _connection_pool.putconn(conn)


def close_db_pool() -> None:
    """Close all connections in the pool. Called on application shutdown."""
    global _connection_pool
    if _connection_pool is not None:
        _connection_pool.closeall()
        _connection_pool = None
        logger.info("Database connection pool closed.")