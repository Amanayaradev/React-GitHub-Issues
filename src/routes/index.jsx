import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Produto from '../pages/produto/index.jsx';

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/produto/:produto' element={<Produto />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
