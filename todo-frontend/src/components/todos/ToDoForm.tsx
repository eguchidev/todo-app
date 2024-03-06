import {
  Box,
  Button,
  Input,
  Select,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export type ToDoFormData = {
  title?: string | undefined;
  description?: string | undefined;
  due_date?: string | undefined;
  status: string;
};

type TodoFormProps = {
  createTodo: (payload: ToDoFormData) => void;
};

const defaultValues: ToDoFormData = {
  title: "",
  description: "",
  due_date: "",
  status: "",
};

const ToDoForm: NextPage<TodoFormProps> = (props: TodoFormProps) => {
  const { createTodo } = props;
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ToDoFormData>({
    defaultValues,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");

  const onSubmit = async (data: ToDoFormData) => {
    const payload = {
        ...data,
        title: title,
        description: description,
        due_date: dueDate,
        status: status,
        };
    await createTodo(payload);

    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("");
    };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="title">
        <FormLabel>タイトル</FormLabel>
        <Input
          type="text"
          value={title}
          placeholder="タイトルを入力"
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>

      <FormControl id="description">
        <FormLabel>内容</FormLabel>
        <Textarea
          value={description}
          placeholder="内容を入力"
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>

      <FormControl id="dueDate">
        <FormLabel>期日</FormLabel>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </FormControl>

      <FormControl id="status">
        <FormLabel>ステータス</FormLabel>
        <Select
          placeholder="ステータスを選択"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="not_started">未着手</option>
          <option value="in_progress">進行中</option>
          <option value="done">完了</option>
        </Select>
      </FormControl>

      <Button mt={4} colorScheme="teal" type="submit">
        作成
      </Button>
    </Box>
  );
};

export default ToDoForm;
