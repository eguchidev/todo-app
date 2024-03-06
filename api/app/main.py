# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.todo import router as todo_router


app = FastAPI()


origins = [
    # "http://localhost:3000",
    "*",  # for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todo_router)
