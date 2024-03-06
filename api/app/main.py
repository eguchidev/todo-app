# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from crud import (
    get_todos,
    search_todos,
    get_todo,
    create_todo,
    update_todo,
    delete_todo,
)
from database import NewToDoInput, UpdateToDoInput


app = FastAPI()

origins = [
    "http://localhost:3000",  # ReactアプリのURL
    # 他のオリジンもここに追加できます
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/todos")
def get_all_todos():
    return get_todos()


@app.get("/todos/search")
def search_all_todos(q: str):
    return search_todos(q)


@app.get("/todos/{todo_id}")
def get_single_todo(todo_id: str):
    return get_todo(todo_id)


@app.post("/todos")
def create_single_todo(create_input: NewToDoInput):
    return create_todo(create_input)


@app.put("/todos")
def update_single_todo(update_input: UpdateToDoInput):
    return update_todo(update_input)


@app.delete("/todos/{todo_id}")
def delete_single_todo(todo_id: str):
    return delete_todo(todo_id)

