// Chakra imports
import {
  Box,
  FormControl,
  Text
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import { useHashConnect } from "../../auth-context/HashConnectProvider";

import FilesApi from "../../api/files";
import { useToast } from "@chakra-ui/react";

export default function Encryption() {

  const uploadRef = useRef(null);
  const downloadRef = useRef(null);
  const { walletData } = useHashConnect();
  const toast = useToast({
    position: "top"
  });

  const onEncryptUpload = async (file)  => {
    toast({
      title: "Uploading file..",
      status: "info",
      duration: 3000,
      isClosable: true
    });

    await FilesApi.Upload(file, walletData.accountIds[0], false).then((response) => {
      toast({
        title: "File Encrypted!",
        status: "success",
        duration: 3000,
        isClosable: true
      });

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
    }).catch(() => {
      toast({
        title: "File Encryption Error",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    });
  };

  const onDecryptUpload = async (file)  => {
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
    <Box style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} pt={{ base: "140px", md: "100px" }}>
      <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <AiFillLock size={64}
          onClick={() => uploadRef.current.click()}
        />
        <FormControl>
          <input type='file'
              onChange={(e) => onEncryptUpload(e.target.files[0])}
              ref={uploadRef}
              style={{display: "none"}} />
          <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Text fontSize={"xl"}>Encrypt</Text>
            <Text fontSize={"xs"}>Encrypt a file.</Text>
          </Box>
        </FormControl>
      </Box>
      <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: "100px" }}>
        <AiFillUnlock size={64}
          onClick={() => downloadRef.current.click()}
        />
        <FormControl>
          <input type='file'
              onChange={(e) => onDecryptUpload(e.target.files[0])}
              ref={downloadRef}
              style={{display: "none"}} />
          <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Text fontSize={"xl"}>Decrypt</Text>
            <Text fontSize={"xs"}>Decrypt a previously encrypted file.</Text>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
}
