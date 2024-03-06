# routers/todo.py
from fastapi import APIRouter, Depends
from crud import (
    get_todos,
    search_todos,
    get_todo,
    create_todo,
    update_todo,
    delete_todo,
)
from database import NewToDoInput, UpdateToDoInput
from auth import get_current_user_auth

router = APIRouter(dependencies=[Depends(get_current_user_auth)])


@router.get("/todos")
def get_all_todos():
    return get_todos()


@router.get("/todos/search")
def search_all_todos(q: str):
    return search_todos(q)


@router.get("/todos/{todo_id}")
def get_single_todo(todo_id: str):
    return get_todo(todo_id)


@router.post("/todos")
def create_single_todo(create_input: NewToDoInput):
    return create_todo(create_input)


@router.put("/todos")
def update_single_todo(update_input: UpdateToDoInput):
    return update_todo(update_input)


@router.delete("/todos/{todo_id}")
def delete_single_todo(todo_id: str):
    return delete_todo(todo_id)
