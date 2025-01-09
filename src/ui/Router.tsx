import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Success from './Success';

const Router = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </MemoryRouter>
  );
};

export default Router;
