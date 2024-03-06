import { Box, Input, Flex, Text, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { ChangeEvent } from "react";
import { NextPage } from "next";

interface TopBarProps {
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TopBar: NextPage<TopBarProps> = ({ handleSearch }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="center"
      wrap="wrap"
      padding="1rem"
      bg="white"
      color="black"
    >
      <Text fontSize="2xl" fontWeight="bold">
        ToDoアプリ
      </Text>
      <Box marginLeft="auto" marginRight="auto">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
          <AiOutlineSearch color="gray.300" />
            </InputLeftElement>
          <Input
            bg="white"
            color="black"
            placeholder="ToDoを検索..."
            _placeholder={{ color: "gray.500" }}
            onChange={handleSearch}
            width="500px"
          />
        </InputGroup>
      </Box>
    </Flex>
  );
};

export default TopBar;

