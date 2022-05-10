// Chakra imports
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  Text
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import { useHashConnect } from "../../auth-context/HashConnectProvider";

import FilesApi from "../../api/files";

export default function Encryption() {

  const uploadRef = useRef(null);
  const downloadRef = useRef(null);
  const { walletData } = useHashConnect();

  const onEncryptUpload = async (file)  => {
    console.log(file);
    await FilesApi.Encrypt(file, walletData.accountIds[0]).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        file.name + '.enc',
      );
  
      // Append to html link element page
      document.body.appendChild(link);
  
      // Start download
      link.click();
  
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
  }

  const onDecryptUpload = async (file)  => {
    console.log(file);
    await FilesApi.Decrypt(file, walletData.accountIds[0]).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        file.name.replace('.enc', ''),
      );
  
      // Append to html link element page
      document.body.appendChild(link);
  
      // Start download
      link.click();
  
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} pt={{ base: "140px", md: "100px" }}>
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AiFillLock size={64}
          onClick={() => uploadRef.current.click()}
        />
        <FormControl>
          <input type='file'
              onChange={(e) => onEncryptUpload(e.target.files[0])}
              ref={uploadRef}
              style={{display: 'none'}} />
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Text fontSize={'xl'}>Encrypt</Text>
            <Text fontSize={'xs'}>Encrypt a file.</Text>
          </Box>
        </FormControl>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '100px' }}>
        <AiFillUnlock size={64}
          onClick={() => downloadRef.current.click()}
        />
        <FormControl>
          <input type='file'
              onChange={(e) => onDecryptUpload(e.target.files[0])}
              ref={downloadRef}
              style={{display: 'none'}} />
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Text fontSize={'xl'}>Decrypt</Text>
            <Text fontSize={'xs'}>Decrypt a previously encrypted file.</Text>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
}
