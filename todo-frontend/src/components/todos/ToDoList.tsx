import { IToDo } from "@/interfaces/todo";
import { Box, Button, Grid, Card, CardBody, CardFooter, ButtonGroup, Heading, Flex, Input, FormControl, FormLabel, Select, Textarea } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";
import ToDoCard from "./ToDoCard";

export type UpdateToDoData = {
    id: string;
    title?: string | undefined;
    description?: string | undefined;
    due_date?: string | undefined;
    status: string;
    };

type ToDoListProps = {
  todos: IToDo[];
  updateToDo: (payload: UpdateToDoData) => void;
  deleteToDo: (id: string) => void;
};

const ToDoList: NextPage<ToDoListProps> = (props: ToDoListProps) => {
    const { todos, updateToDo, deleteToDo } = props;
    return (
      <Box>
        <Heading as="h2" size="xl" mb={5}>ToDoリスト</Heading>
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {todos.map((todo) => (
            <ToDoCard key={todo.id} todo={todo} updateToDo={updateToDo} deleteToDo={deleteToDo} />
          ))}
        </Grid>
      </Box>
    );
  };

export default ToDoList;
