// Chakra imports

import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";

export default function Files() {

  return (
    <Flex mt={"100px"}>
      <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="12px 0px 28px 0px">
          <Flex direction="column">
            <Text
              fontSize="lg"
              fontWeight="bold"
              pb=".5rem"
            >
              My Files
            </Text>
          </Flex>
        </CardHeader>
        <Table variant="simple" width="100%">
          <Thead>
            <Tr my=".8rem" ps="0px">
              <Th color="gray.400">Name</Th>
              <Th color="gray.400">Size</Th>
              <Th color="gray.400">Uploaded</Th>
              <Th color="gray.400">Access List</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                contract.pdf
              </Td>
              <Td>
                125 MB
              </Td>
              <Td>
                3/15/2022 10:00 am
              </Td>
              <Td>
                6 Users
              </Td>
            </Tr>
            <Tr>
              <Td>
                headshot.png
              </Td>
              <Td>
                125 MB
              </Td>
              <Td>
                3/15/2022 10:00 am
              </Td>
              <Td>
                6 Users
              </Td>
            </Tr>
            <Tr>
              <Td>
                customers.zip
              </Td>
              <Td>
                231 MB
              </Td>
              <Td>
                3/19/2022 8:31 am
              </Td>
              <Td>
                2 Users
              </Td>
            </Tr>
            <Tr>
              <Td>
                intro.mp4
              </Td>
              <Td>
                512 MB
              </Td>
              <Td>
                4/11/2022 1:15 pm
              </Td>
              <Td>
                4 Users
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Card>
    </Flex>
  );
}
