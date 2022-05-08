from typing import Tuple
import bcrypt

class HASH():
    """Classe zum Hashen und zum Salzen des Passwortest"""
    
    def hash_password(self, password: str) -> Tuple[bytes, bytes]:
        """
        Hash the provided password with a randomly-generated salt and return the
        hash to store in the database.
        """
        salt = bcrypt.gensalt()
        pw_hash = bcrypt.hashpw(password.encode(encoding='utf-8'), salt)

        return pw_hash.decode()

    def is_correct_password(self, pw_hash: str, password: str) -> bool:
        """
        Given a previously-stored hash, and a password provided by a user
        trying to log in, check whether the password is correct.
        """

        success = bcrypt.checkpw(password.encode('utf-8'), pw_hash.encode())

        return success 

