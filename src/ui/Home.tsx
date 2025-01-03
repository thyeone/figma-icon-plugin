import React, { useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Progress from './Progress';

enum Step {
  Pending,
  Processing,
  Resolved,
}

export default function Home() {
  const [isFigmaVisible, setIsFigmaVisible] = useState(false);
  const [isBitbucketVisible, setIsBitbucketVisible] = useState(false);

  const [step, setStep] = useState(Step.Pending);

  const [exportPath, setExportPath] = useState('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setStep(Step.Processing);

    parent.postMessage({ pluginMessage: { type: 'extract' } }, '*');
  };

  return (
    <Box p="16px">
      <Text fontSize="12px" mb="6px">
        Figma Token
      </Text>
      <Box position="relative">
        <Input
          type={isFigmaVisible ? 'text' : 'password'}
          size="xs"
          rounded="md"
          placeholder="Enter your Figma token"
        />
        {isFigmaVisible ? (
          <ViewIcon
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            onClick={() => setIsFigmaVisible(false)}
          />
        ) : (
          <ViewOffIcon
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            onClick={() => setIsFigmaVisible(true)}
          />
        )}
      </Box>
      <Text fontSize="12px" mb="6px" mt="12px">
        Bitbucket Token
      </Text>
      <Box position="relative">
        <Input
          type={isBitbucketVisible ? 'text' : 'password'}
          size="xs"
          rounded="md"
          placeholder="Enter your Bitbucket token"
        />
        {isBitbucketVisible ? (
          <ViewIcon
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            onClick={() => setIsBitbucketVisible(false)}
          />
        ) : (
          <ViewOffIcon
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            onClick={() => setIsBitbucketVisible(true)}
          />
        )}
      </Box>
      <Text fontSize="12px" mb="6px" mt="12px">
        추출할 경로
      </Text>
      <Input
        type="text"
        defaultValue="src/components/icon"
        size="xs"
        rounded="md"
        onChange={(e) => setExportPath(e.target.value)}
      />
      {step === Step.Pending && (
        <Flex justify="flex-end" mt="12px">
          <Button
            type="button"
            size="xs"
            colorScheme="blue"
            onClick={handleSubmit}
          >
            추출하기
          </Button>
        </Flex>
      )}
      {step === Step.Processing && <Progress />}
    </Box>
  );
}
