import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import Success from './Success';

const router = createMemoryRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/success',
    element: <Success />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
