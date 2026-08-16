from app.schemas.user import UserRegister

user = UserRegister(
    fullname="Rajesh R",
    email="rajesh@gmail.com",
    password="admin123",
    role="Citizen"
)

print(user)