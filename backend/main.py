from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.models.user import User
from app.models.report import Report
from app.models.notification import Notification

from app.routers.auth import router as auth_router
from app.routers.protected import router as protected_router
from app.routers.report import router as report_router
from app.routers.dashboard import router as dashboard_router
from app.routers.notification import router as notification_router
from fastapi.staticfiles import StaticFiles
from routes.ai import router as ai_router
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PaveSentinel AI API",
    version="1.0"
)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)
app.mount(
    "/ai/outputs",
    StaticFiles(directory="ai/outputs"),
    name="ai_outputs"
)

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://pave-sentinel-ai.vercel.app",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(report_router)
app.include_router(protected_router)
app.include_router(dashboard_router)
app.include_router(notification_router)
app.include_router(ai_router)
@app.get("/")
def home():
    return {"message": "Backend Running"}