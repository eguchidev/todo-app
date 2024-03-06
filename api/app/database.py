# database.py
from pynamodb.models import Model
from datetime import datetime
from enum import Enum
from pydantic import Field
from pynamodb.attributes import (
    UnicodeAttribute,
    UTCDateTimeAttribute,
)
import os
from pydantic import BaseModel
from typing import Optional


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
