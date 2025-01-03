import ReactDOM from 'react-dom';
import Router from './Router';
import { ChakraProvider } from '@chakra-ui/react';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ChakraProvider>
      <Router />
    </ChakraProvider>,
    document.getElementById('root'),
  );
});
