import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Paginação vinda da API
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProducts = useCallback(async (pageNumber = 1, search = '', category = 'all') => {
    setLoading(true);
    try {
      // Construindo a URL com os filtros para o Back-end processar
      // Ex: /products?page=1&search=cadeira&category_id=2
      let url = `/products?page=${pageNumber}`;
      if (search) url += `&search=${search}`;
      if (category !== 'all') url += `&category_id=${category}`;

      console.log('🔍 Buscando produtos com URL:', url); // LOG 1
      
      const res = await api.get(url);
      
      console.log('📦 Resposta completa da API:', res.data); // LOG 2
      console.log('📊 Meta da API:', res.data.meta); // LOG 3
      console.log('🔢 totalItems da API:', res.data.meta?.total); // LOG 4
      
      // Dados baseados no JSON que você enviou
      setProducts(res.data.data || []);
      
      // Metadados da paginação
      setTotalPages(res.data.meta.last_page || 1);
      setTotalItems(res.data.meta.total || 0);
      
      console.log('✅ totalItems atualizado para:', res.data.meta.total || 0); // LOG 5
      
    } catch (err) {
      console.error("❌ Erro ao carregar produtos", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar categorias", err);
    }
  }, []);

  // Busca inicial e sempre que a página, busca ou filtro mudar
  useEffect(() => {
    fetchProducts(page, searchTerm, categoryFilter);
  }, [page, searchTerm, categoryFilter, fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Cálculo de valor total (Baseado nos produtos da página atual)
  const totalValue = products.reduce((acc, p) => acc + parseFloat(p.price || 0), 0);

  // Log do retorno do hook
  console.log('🔄 Hook retornando - totalItems:', totalItems, 'products:', products.length); // LOG 6

  return {
    products, 
    filteredProducts: products,
    categories, 
    loading,
    searchTerm, 
    setSearchTerm, 
    categoryFilter, 
    setCategoryFilter,
    page, 
    setPage, 
    totalPages,
    totalItems,
    totalValue, 
    fetchProducts: () => fetchProducts(page, searchTerm, categoryFilter)
  };
}