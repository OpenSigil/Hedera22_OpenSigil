// Chakra imports
import {
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { useHashConnect } from "auth-context/HashConnectProvider";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { SettingsIcon } from "components/Icons/Icons";
import React, { useEffect, useState } from "react";
import FilesApi from "../../api/files";
import { DateTime } from "luxon";

export default function Dashboard() {

  const [files, setFiles] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { walletData } = useHashConnect();

  useEffect(() => {
    async function fetch() {
      await FilesApi.List(walletData.accountIds[0]).then((response) => {
        setFiles(response.data.account_data);
      });
    }

    fetch();
  }, []);

  // This use effect will be triggered once files have been retrieved
  useEffect(() => {
    async function fetch() {
      if (hasLoaded || files == null) {
        return;
      }
  
      const updatedFiles = [...files];
  
      for (let i = 0; i < files.length; i++) {
        await FilesApi.ListAccess(files[i].contractId).then((response) => {
          let accessList = response.data.access_list;
          updatedFiles[i].accessList = accessList;
        });
      }
  
      setFiles(updatedFiles);
      setHasLoaded(true);
    }
    fetch();
  }, [files]);

  if (!hasLoaded) {
    return (
        <Flex mt={"100px"} ml="20px">
          <Spinner />
        </Flex>
    );
  }

  function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + " B";
    }
  
    const units = si 
      ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] 
      : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + " " + units[u];
  }

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
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
                <Th color="gray.400">Edit</Th>
                <Th color="gray.400">Name</Th>
                <Th color="gray.400">Hash</Th>
                <Th color="gray.400">Size</Th>
                <Th color="gray.400">Uploaded</Th>
                <Th color="gray.400">Access List</Th>
              </Tr>
            </Thead>
            <Tbody>
              {files.map((file) => {
                  return (
                    <Tr>
                      <Td><SettingsIcon /></Td>
                      <Td>
                        {file.fileName}
                      </Td>
                      <Td>
                        {file.fileHash}
                      </Td>
                      <Td>
                        {humanFileSize(file.fileSize)}
                      </Td>
                      <Td>
                        {DateTime.fromISO(file.uploadedAt).toLocaleString(DateTime.DATETIME_SHORT)}
                      </Td>
                      <Td>
                        {file.accessList != null ? file.accessList.length : 0} Users
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </Card>
    </Flex>
  );
}
