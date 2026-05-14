def is_prime(n: int) -> bool:
    """
    Return True if n is a prime number.
    Used to filter cargo records after weight computation.
    """
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True