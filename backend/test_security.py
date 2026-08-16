from app.core.security import hash_password
from app.core.security import verify_password
from app.core.security import create_access_token

password = "admin123"

hashed = hash_password(password)

print("Hashed Password:")
print(hashed)

print()

print("Password Match:")
print(verify_password(password, hashed))

print()

token = create_access_token(
    {"sub": "admin@gmail.com"}
)

print("JWT Token:")
print(token)