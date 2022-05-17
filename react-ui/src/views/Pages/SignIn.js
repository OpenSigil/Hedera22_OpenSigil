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
    title: "How do I use OpenSigil?",
    contents: "You'll need the Google Chrome Browser (https://www.google.com/chrome/downloads/) and the Hashpack wallet extension (https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk). Once those are installed and you'll need to reload the page, click the 'Connect' button, and a TESTNET Hashpack wallet."
  },
  {
    title: "Who can use OpenSigil?",
    contents: "Anyone with the requirements listed above!"
  },
  {
    title: "How secure is OpenSigil?",
    contents: "While we tried our best to make this application as secure as possible, this is only a demonstration of our application and it's features. We cannot guarantee completely secure file exchange at this time. Please do not send actual confidential information, or use anything besides disposable testnet wallets."
  },
  {
    title: "When will OpenSigil be out of beta?",
    contents: "We cant say for sure quite yet, we have to pause development until the judging is completed at the end of May. We're still several weeks away from a Mainnet release which will be with just a subset of beta users. But stay tuned for more information coming soon!"
  },
  {
    title: "Where can I find out more?",
    contents: "The source code, and more information can be found at (https://github.com/OpenSigil/Hedera22_OpenSigil). And more information about our hackathon submission can be found at (https://devpost.com/software/opensigil)"
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
