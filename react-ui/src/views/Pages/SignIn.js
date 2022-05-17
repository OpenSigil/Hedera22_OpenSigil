import React from "react";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel
} from "@chakra-ui/react";
// Assets
import { useHistory } from "react-router-dom";
import { useHashConnect } from "../../auth-context/HashConnectProvider";

const FAQ_CATEGORIES = [
  {
    title: "How is OpenSigil different than other file hosting sites?",
    contents: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. "
  },
  {
    title: "Who can use OpenSigil?",
    contents: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. "
  },
  {
    title: "How do I use OpenSigil?",
    contents: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. "
  }
];

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
          <Flex
            marginTop="200px"
            flexDirection={"column"}
          >
            <Text
              fontSize="3xl"
            >
              Frequently Asked Questions
            </Text>
            <Accordion
              allowMultiple
              allowToggle
            >
              {FAQ_CATEGORIES.map(category => 
                <AccordionItem
                  width="80%"
                  marginTop={"15px"}
                >
                  <h2>
                    <AccordionButton>
                      <AccordionIcon />
                      <Box>
                        {category.title}
                      </Box>
                    </AccordionButton>
                  </h2>

                  <AccordionPanel>
                    {category.contents}
                  </AccordionPanel>
                </AccordionItem>
              )}
            </Accordion>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
