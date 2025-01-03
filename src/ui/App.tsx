import React from 'react';
import { Button, ChakraProvider, Flex } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Flex justify="center" align="center" h="100vh" w="100vw">
        <Button>Hello World</Button>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
