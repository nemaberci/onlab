import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

type props = {
  to: string;
};

type menuToggleProps = {
  toggle: () => void;
  isOpen: boolean;
};

export const MenuToggle: FC<menuToggleProps> = ({ toggle, isOpen }: any) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <FaTimes /> : <FaBars />}
    </Box>
  );
};

export const MenuItem: FC<props> = ({ to = "/", children }) => {
  return (
    <Button variant={"ghost"}>
      <Link to={to}>
        <Text display="block">{children}</Text>
      </Link>
    </Button>
  );
};

export const Navbar: FC = ({ children }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={6}
    >
      {children}
    </Flex>
  );
};
