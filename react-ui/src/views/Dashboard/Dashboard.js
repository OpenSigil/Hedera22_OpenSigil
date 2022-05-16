// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import { useHashConnect } from "auth-context/HashConnectProvider";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useEffect, useRef, useState } from "react";
import FilesApi from "../../api/files";
import { DateTime } from "luxon";
import { useToast } from "@chakra-ui/react";

import { ImEye, ImPencil, ImDownload3 } from "react-icons/im";

export default function Dashboard() {

  const [files, setFiles] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [ hasLoadedAccess, setHasLoadedAccess ] = useState(false);
  const { walletData } = useHashConnect();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  /**
   * Upload variables
   */
  // Modal for Upload
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  // Upload input ref
  const uploadRef = useRef(null);
  // State fields to determine if a file has been selected in the input
  const [ fileUploaded, setFileUploaded ] = useState(null);
  // State fields to determine if the file should be uploaded to web3
  const [ uploadToWeb3, setUploadToWeb3 ] = useState(true);

  // Modal for view
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();

  // State fields for file settings
  const [addAccountId, setAddAccountId] = useState("");
  const [revokeAccountId, setRevokeAccountId] = useState("");

  const toast = useToast({
    position: "top"
  });

  const loadFiles = async () => {
    let response = await FilesApi.ListFiles(walletData.accountIds[0]);

    if (response.data.account_data != null) {
      setFiles(response.data.account_data);
    }

    setHasLoaded(true);
  };

  const loadAccessLists = async() => {
    if (hasLoadedAccess || files == null) {
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
    setHasLoadedAccess(true);
  };

  useEffect(() => {
    async function fetch() {
      await loadFiles();
    }

    fetch();
  }, []);

  // This use effect will be triggered once files have been retrieved
  useEffect(() => {
    async function fetch() {
      await loadAccessLists();
    }
    fetch();
  }, [files]);

  useEffect(() => {
    async function fetch() {
      if (!hasLoadedAccess) {
        await loadAccessLists();
      }
    }
    fetch();
  }, [hasLoadedAccess]);

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

  const onUpload = async (file)  => {
    toast({
      title: "Uploading file..",
      status: "info",
      duration: 30000,
      isClosable: true
    });

    await FilesApi.Upload(file, walletData.accountIds[0], uploadToWeb3).then(async (response) => {
      toast.closeAll();
      toast({
        title: uploadToWeb3 ? "File Uploaded!" : "File Encrypted!",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      if (!uploadToWeb3) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          file.name + ".enc",
        );
    
        // Append to html link element page
        document.body.appendChild(link);
    
        // Start download
        link.click();
    
        // Clean up and remove the link
        link.parentNode.removeChild(link);
      }

      setHasLoaded(false);
      setHasLoadedAccess(false);
      await loadFiles();
    }).catch(() => {
      toast({
        title: "File Encryption Error",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    });
  };

  const onDownload = async (file) => {
    toast({
      title: "Downloading file..",
      status: "info",
      duration: 30000,
      isClosable: true
    });

    await FilesApi.Download(walletData.accountIds[0], file.contractId).then((response) => {
      toast.closeAll();
      toast({
        title: "File Downloaded!",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        file.fileName.replace(".enc", ""),
      );
  
      // Append to html link element page
      document.body.appendChild(link);
  
      // Start download
      link.click();
  
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    }).catch(() => {
      toast.closeAll();
      toast({
        title: "Not Authorized For File",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    });
  };

  const onDecrypt = async (file)  => {
    toast({
      title: "Uploading file..",
      status: "info",
      duration: 3000,
      isClosable: true
    });
    await FilesApi.Decrypt(file, walletData.accountIds[0]).then((response) => {
      toast({
        title: "File Decrypted!",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        file.name.replace(".enc", ""),
      );
  
      // Append to html link element page
      document.body.appendChild(link);
  
      // Start download
      link.click();
  
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    }).catch(() => {
      toast({
        title: "Not Authorized For File",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    });
  };

  return (
    <>
      {selectedFile != null && <Modal isOpen={isEditOpen} onClose={onEditClose}>
      <ModalOverlay />
        <ModalContent>
          <ModalHeader>File Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedFile?.accessList?.length > 0 && <Box>
            <Text fontSize='2xl' fontWeight="bold">
              Access List
            </Text>
            {selectedFile.accessList.map((accountId) => {
              return (
                <Text>
                  {accountId}
                </Text>
              );
            })}
            </Box>}

            <br />

            <Text fontSize='2xl' fontWeight="bold">
              Add Account Access
            </Text>
            <Input onInput={(e) => setAddAccountId(e.target.value)} placeholder='Account ID' />

            <br />

            <Text fontSize='2xl' fontWeight="bold">
              Revoke Account Access
            </Text>
            <Input onInput={(e) => setRevokeAccountId(e.target.value)} placeholder='Account ID' />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={async () => {
              if (addAccountId != "") {
                await FilesApi.AddAccess(selectedFile.contractId, addAccountId);
              }

              if (revokeAccountId != "") {
                await FilesApi.RevokeAccess(selectedFile.contractId, revokeAccountId);
              }

              toast({
                title: "Updated Access",
                status: "success",
                duration: 2000,
                isClosable: true
              });

              setSelectedFile(null);

              if (addAccountId != "" || revokeAccountId != "") {
                window.location.reload();
              }
            }}
            >
              Save
            </Button>
            <Button 
              variant='ghost' 
              onClick={() => {
                setSelectedFile(null);
                onEditClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>}

      {selectedFile != null && <Modal isOpen={isViewOpen} onClose={onViewClose}>
      <ModalOverlay />
        <ModalContent>
          <ModalHeader>File Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedFile?.accessList?.length > 0 && <Box>
            <Text fontSize='2xl' fontWeight="bold">
              Access List
            </Text>
            {selectedFile.accessList.map((accountId) => {
              return (
                <Text>
                  {accountId}
                </Text>
              );
            })}
            </Box>}

            <br />

            <Text fontSize='2xl' fontWeight="bold">
              File Hash
            </Text>
            <Text>
              {selectedFile.fileHash}
            </Text>
            <br />
            {selectedFile.cid && <Box>
              <Text fontSize='2xl' fontWeight="bold">
              Web3 CID
            </Text>
            <Text>
              {selectedFile.cid}
            </Text>
            </Box>}
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme='blue' 
              mr={3} 
              onClick={() => {
                setSelectedFile(null);
                onViewClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>}

      <Modal isOpen={isUploadOpen} onClose={onUploadClose}>
      <ModalOverlay />
        <ModalContent>
          <ModalHeader>Encrypt File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection='column'>
              <input 
                id='upload-input'
                type='file'
                ref={uploadRef}
                style={{display: "none"}} 
                onChange={(e) => {
                  let fullPath = e.target.value;
                  var startIndex = (fullPath.indexOf("\\") >= 0 ? fullPath.lastIndexOf("\\") : fullPath.lastIndexOf("/"));
                  var filename = fullPath.substring(startIndex);
                  if (filename.indexOf("\\") === 0 || filename.indexOf("/") === 0) {
                      filename = filename.substring(1);
                  }

                  if (e.target.files[0].size >= (1000*1000*100)) {
                    toast({
                      title: "Files above 100MB are currently not supported.",
                      status: "error",
                      duration: 3000,
                      isClosable: true
                    });

                    e.target.value = null;
                    setFileUploaded(null);
                    return;
                  }

                  setFileUploaded(filename);
                }}
              />
              <Button
                onClick={() => uploadRef.current.click()}
                width='30%'
              >
                Select File
              </Button>
              {fileUploaded && 
              <Text fontSize="sm">
                {fileUploaded}  
              </Text>}

              <br />

              <Checkbox 
                isChecked={uploadToWeb3}
                onChange={(e) => setUploadToWeb3(e.target.checked)}
              >
                Upload using Web3.Storage
              </Checkbox>
              
              <br />

              <Text fontSize='sm'>
                Files are always securely encrypted. Files uploaded to Web3.storage will be immediately available, otherwise the encrypted file will be downloaded to your local machine.
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme='blue' 
              mr={3} 
              isDisabled={!fileUploaded}
              onClick={() => {
                onUploadClose();
                onUpload(uploadRef.current.files[0]);
              }}
            >
              Save
            </Button>
            <Button variant='ghost' onClick={onUploadClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
        <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
            <CardHeader p="12px 0px 28px 0px">
              <Flex justifyContent='space-between' width='100%'>
                <Flex direction="column">
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    pb=".5rem"
                  >
                    My Files
                  </Text>
                </Flex>
                <Flex>
                  <Button
                    onClick={onUploadOpen}
                  >
                    Encrypt
                  </Button>
                  <input type='file'
                    onChange={(e) => onDecrypt(e.target.files[0])}
                    ref={uploadRef}
                    style={{display: "none"}} />
                  <Button
                    style={{ marginLeft: "15px" }}
                    onClick={() => uploadRef.current.click()}
                  >
                    Decrypt
                  </Button>
                </Flex>
              </Flex>
            </CardHeader>
            {files == null ? "Nothing to display" : <Table variant="simple" width="100%">
              <Thead>
                <Tr my=".8rem" ps="0px">
                  <Th color="gray.400">Actions</Th>
                  <Th color="gray.400">File Name</Th>
                  <Th color="gray.400">Type</Th>
                  <Th color="gray.400">Size</Th>
                  <Th color="gray.400">Uploaded</Th>
                  <Th color="gray.400">Access List</Th>
                </Tr>
              </Thead>
              <Tbody>
                {files?.map((file) => {
                    return (
                      <Tr>
                        <Td
                          width="5%"
                        >
                          <Flex>
                            <ImEye 
                              onClick={() => {
                                setSelectedFile(file);
                                onViewOpen();
                              }}
                            />
                            <ImPencil 
                              style={{ marginLeft: "10px" }} 
                              onClick={() => {
                                setSelectedFile(file);
                                onEditOpen();
                              }}
                            />
                            {file.cid && 
                              <ImDownload3 
                                style={{ marginLeft: "10px" }} 
                                onClick={() => onDownload(file)}
                              />
                            }
                          </Flex>
                        </Td>
                        <Tooltip label={
                          <Box>
                            <Text>
                              File Hash
                            </Text>
                            <Text>
                              {file.fileHash}
                            </Text>
                            {file.cid && <Box>
                              <Text>
                                CID
                              </Text>
                              <Text>
                                {file.cid}
                              </Text>
                              </Box>}
                          </Box>
                        }>
                          <Td>
                            {file.fileName}
                          </Td>
                        </Tooltip>
                        <Td>
                          {file.cid ? "Web3" : "Local"}
                        </Td>
                        <Td>
                          {humanFileSize(file.fileSize)}
                        </Td>
                        <Td>
                          {DateTime.fromISO(file.uploadedAt).toLocaleString(DateTime.DATETIME_SHORT)}
                        </Td>
                        <Td>
                          {file.accessList != null ? file.accessList.length - 1 : 0} Users
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>}
          </Card>
      </Flex>
    </>
  );
}
