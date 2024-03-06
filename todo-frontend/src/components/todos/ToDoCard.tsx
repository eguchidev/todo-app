import { IToDo } from "@/interfaces/todo";
import { Box, Button, Grid, Card, CardBody, CardFooter, ButtonGroup, Heading, Flex, Input, FormControl, FormLabel, Select, Textarea } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useState } from "react";

export type UpdateToDoData = {
    id: string;
    title?: string | undefined;
    description?: string | undefined;
    due_date?: string | undefined;
    status: string;
};

type ToDoCardProps = {
  todo: IToDo;
  updateToDo: (payload: UpdateToDoData) => void;
  deleteToDo: (id: string) => void;
};

const ToDoCard: NextPage<ToDoCardProps> = (props: ToDoCardProps) => {
    const { todo, updateToDo, deleteToDo } = props;

    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description);
    const [dueDate, setDueDate] = useState(todo.due_date);
    const [status, setStatus] = useState(todo.status);

    const handleUpdateToDoClick = () => {
        const data = {
            id: todo.id,
            title: title,
            description: description,
            due_date: dueDate,
            status: status,
        };
        updateToDo(data);
    };

    return(
  <Card key={todo.id} p={5} shadow="md" borderWidth="1px" w="full">
    <CardBody>
      <FormControl id="title">
        <FormLabel>タイトル</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} fontWeight="bold" />
      </FormControl>
      <FormControl id="status" mt={4}>
        <FormLabel>ステータス</FormLabel>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="not_started">未着手</option>
          <option value="in_progress">進行中</option>
          <option value="done">完了</option>
        </Select>
      </FormControl>
      <FormControl id="due_date" mt={4}>
        <FormLabel>期限日</FormLabel>
        <Input type="date" value={dueDate?.split('T')[0]} onChange={(e) => setDueDate(e.target.value)} />
      </FormControl>
      <FormControl id="description" mt={4}>
        <FormLabel>内容</FormLabel>
        <Textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>
    </CardBody>
    <CardFooter>
      <Flex justifyContent="center">
        <ButtonGroup variant='outline' spacing='6'>
          <Button colorScheme='blue' onClick={handleUpdateToDoClick}>更新</Button>
          <Button onClick={() => deleteToDo(todo.id)}>削除</Button>
        </ButtonGroup>
      </Flex>
    </CardFooter>
  </Card>);
}

export default ToDoCard;
