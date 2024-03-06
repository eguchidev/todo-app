# crud.py
from fastapi import HTTPException
import logging
import uuid
from database import ToDoModel, NewToDoInput, UpdateToDoInput


def get_todos():
    todos = ToDoModel.scan()
    return [todo.attribute_values for todo in todos]


def search_todos(q: str):
    todos = ToDoModel.scan()
    result = []
    for todo in todos:
        if q in todo.title or q in todo.description:
            result.append(todo.attribute_values)
    return result


def get_todo(todo_id: str):
    try:
        todo = ToDoModel.get(todo_id)
        logging.info(todo)
        return todo.attribute_values
    except ToDoModel.DoesNotExist:
        logging.error("ToDo does not exist.")
        raise HTTPException(status_code=404, detail="todo_not_found")


def create_todo(create_input: NewToDoInput):
    if not ToDoModel.exists():
        ToDoModel.create_table(
            read_capacity_units=1,
            write_capacity_units=1,
            wait=True
        )
        print("Table created and waiting until it is active")
    todo_id = uuid.uuid4()
    todo = ToDoModel(
        id=str(todo_id),
        title=create_input.title,
        description=create_input.description,
        due_date=create_input.due_date,
        status=create_input.status.value
    )
    todo.save()
    return todo.attribute_values


def update_todo(update_input: UpdateToDoInput):
    try:
        todo = ToDoModel.get(update_input.id)
        todo.title = update_input.title
        todo.description = update_input.description
        todo.due_date = update_input.due_date
        todo.status = update_input.status
        todo.save()
        return todo.attribute_values
    except ToDoModel.DoesNotExist:
        logging.error("ToDo does not exist.")
        raise HTTPException(status_code=404, detail="todo_not_found")


def delete_todo(todo_id: str):
    try:
        todo = ToDoModel.get(todo_id)
        todo.delete()
        return {"message": "todo_deleted"}
    except ToDoModel.DoesNotExist:
        logging.error("ToDo does not exist.")
        raise HTTPException(status_code=404, detail="todo_not_found")
