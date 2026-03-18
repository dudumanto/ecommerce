import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Trocado para HashRouter
import ProductsList from './pages/ProductsList';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryForm from './pages/CategoryForm'; 
import ProductForm from './pages/ProductForm';
import AdminProducts from './pages/AdminProducts';

function App() {
  return (
    /* O HashRouter usa um '#' na URL (ex: localhost:3000/#/admin/products).
       Isso faz com que o navegador NUNCA peça a rota ao servidor,
       resolvendo o erro 404 no refresh (F5).
    */
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/categories/new" element={<CategoryForm />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/edit/:id" element={<ProductForm />} />
        <Route path="/admin/products" element={<AdminProducts/>}/>
        
        {/* Rota de fallback para evitar tela branca caso digitem algo errado */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;