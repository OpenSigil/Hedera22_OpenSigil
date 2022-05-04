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

  return (
    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} pt={{ base: "140px", md: "100px" }}>
    </Box>
  );
}
