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

export default function Files() {

  const uploadRef = useRef(null);
  const downloadRef = useRef(null);

  const onEncryptUpload = async (file)  => {
    console.log(file);
    const buffer = await file.arrayBuffer();
    let byteArray = new Int8Array(buffer);
    console.log(byteArray)
  }

  const onDecryptUpload = async (file)  => {
    console.log(file);
    const buffer = await file.arrayBuffer();
    let byteArray = new Int8Array(buffer);
    console.log(byteArray)
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
