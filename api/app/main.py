from fastapi import FastAPI
from pydantic import BaseModel
from pynamodb.models import Model
from fastapi import HTTPException
from typing import Optional
import logging
import uuid
import os
from datetime import datetime
from enum import Enum
from pydantic import Field
from pynamodb.attributes import (
    UnicodeAttribute,
    UTCDateTimeAttribute,
)
from fastapi.middleware.cors import CORSMiddleware


class Status(str, Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    done = "done"


class ToDoModel(Model):
    # 接続先情報(クレデンシャルやテーブル情報)を定義
    class Meta:
        host = os.environ.get("DYNAMODB_HOST")
        aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID")
        aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
        region = os.environ.get("REGION")
        table_name = "todo"

    # テーブル属性定義
    id = UnicodeAttribute(hash_key=True)
    title = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)
    due_date = UTCDateTimeAttribute(null=True)
    status = UnicodeAttribute(null=True)


class NewToDoInput(BaseModel):
    title: Optional[str]
    description: Optional[str]
    due_date: Optional[datetime]
    status: Optional[Status] = Field(default=Status.not_started)


class UpdateToDoInput(BaseModel):
    id: str
    title: Optional[str]
    description: Optional[str]
    due_date: Optional[datetime]
    status: Optional[Status]


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
def get_todos():
    todos = ToDoModel.scan()
    return [todo.attribute_values for todo in todos]


@app.get("/todos/search")
def search_todos(q: str):
    todos = ToDoModel.scan()
    result = []
    for todo in todos:
        if q in todo.title or q in todo.description:
            result.append(todo.attribute_values)
    return result


@app.get("/todos/{todo_id}")
def get_todo(todo_id: str):
    try:
        todo = ToDoModel.get(todo_id)
        logging.info(todo)
        return todo.attribute_values
    except ToDoModel.DoesNotExist:
        logging.error("ToDo does not exist.")
        raise HTTPException(status_code=404, detail="todo_not_found")


@app.post("/todos")
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


@app.put("/todos")
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


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: str):
    try:
        todo = ToDoModel.get(todo_id)
        todo.delete()
        return {"message": "todo_deleted"}
    except ToDoModel.DoesNotExist:
        logging.error("ToDo does not exist.")
        raise HTTPException(status_code=404, detail="todo_not_found")
