import React from "react";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  Text
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/signInImage.png";
import { useHistory } from "react-router-dom";
import { useHashConnect } from "../../auth-context/HashConnectProvider";

function SignIn() {
  // HashConnect things
  const { connect, walletData, installedExtensions, hasConnected } = useHashConnect();

  const history = useHistory();

  const handleClick = () => {
    if (installedExtensions) {
      connect();
    }
    else if (walletData) {
      history.push("/dashboard");
    }
    else {
      alert("Please install hashconnect wallet extension first. from chrome web store.");
    }
  };

  if (hasConnected) {
    history.push("/dashboard");
  }
  
  return (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "75%", md: "50%", lg: "42%" }}
          mt="300px"
        >
          <Text>Click the connect button below to login using the HashConnect extension.</Text>
          <Button
            fontSize="10px"
            type="submit"
            bg="teal.300"
            w="100%"
            h="45"
            mb="20px"
            color="white"
            mt="20px"
            _hover={{
              bg: "teal.200",
            }}
            _active={{
              bg: "teal.400",
            }}
            onClick={handleClick}
          >
            Connect
          </Button>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="40vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
