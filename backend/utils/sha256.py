from hashlib import sha256
from config import PASSWORD_HASH_SALT

def hash_password_with_salt(password: str) -> str:
    return sha256((password + PASSWORD_HASH_SALT).encode('utf-8')).hexdigest()