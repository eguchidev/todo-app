import React, { useState } from "react";
import { Box, Input, Button, VStack, Checkbox, Heading, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import ToDoForm from "@/components/todos/ToDoForm";
import axios from "axios";
import { ToDoFormData } from "@/components/todos/ToDoForm";
import ToDoList, { UpdateToDoData } from "@/components/todos/ToDoList";
import { IToDo } from "@/interfaces/todo";
import TopBar from "@/common/components/TopBar";
import { useToast } from "@chakra-ui/react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const ToDo: NextPage = () => {
  const toast = useToast();
  const [todos, setTodos] = useState<IToDo[]>([]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${url}/todos`);
      if (response.status === 200) {
        setTodos(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // useEffectを使用して、コンポーネントがマウントされたときにToDoをフェッチします
  React.useEffect(() => {
    fetchTodos();
  }, []);

  const deleteToDo = async (id: string) => {
    try {
      // const response = await axios.delete(`http://localhost:3001/todos/${id}`);
      const response = await axios.delete(`${url}/todos/${id}`);
      if (response.status === 200) {
        fetchTodos();
        toast({
          title: "ToDoの削除に成功しました。",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const updateToDo = async (payload: UpdateToDoData) => {
    try {
      const response = await axios.put(`${url}/todos`, payload);
      if (response.status === 200) {
        fetchTodos();
        toast({
          title: "ToDoの更新に成功しました。",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const createToDo = async (payload: ToDoFormData) => {
    try {
      const response = await axios.post(`${url}/todos`, payload);
      if (response.status === 200) {
        fetchTodos();
        toast({
          title: "ToDoの作成に成功しました。",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    try {
      const response = await axios.get(`${url}/todos/search?q=${query}`);
      if (response.status === 200) {
        setTodos(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex h="100vh" direction="column">
      <Box position="fixed" width="100%" zIndex="100">
        <TopBar handleSearch={handleSearch} />
      </Box>
      <VStack pt="60px" p={4}>
        <Box w="500px" p={20}>
          <ToDoForm  createTodo={createToDo} />
        </Box>
        <Box>
          <ToDoList todos={todos} deleteToDo={deleteToDo} updateToDo={updateToDo} />
        </Box>
      </VStack>
    </Flex>
  );
};

export default ToDo;