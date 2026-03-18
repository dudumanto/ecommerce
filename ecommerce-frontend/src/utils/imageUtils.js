// src/utils/imageUtils.js
import { IMAGE_BASE_URL } from '../config';

/**
 * Retorna a URL completa da imagem do produto
 * @param {string} imagePath - Caminho da imagem (ex: "products/nome.jpg" ou "nome.jpg")
 * @returns {string} URL completa da imagem
 */
export const getProductImageUrl = (imagePath) => {
  if (!imagePath) return `${IMAGE_BASE_URL}placeholder.jpg`;
  
  // Se já é uma URL completa, retorna como está
  if (imagePath.startsWith('http')) return imagePath;
  
  // Remove barras extras e garante o formato correto
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  // Se já começa com 'products/', mantém
  if (cleanPath.startsWith('products/')) {
    return `${IMAGE_BASE_URL}${cleanPath}`;
  }
  
  // Se não, adiciona 'products/'
  return `${IMAGE_BASE_URL}products/${cleanPath}`;
};

/**
 * Retorna a URL completa da imagem de categoria (se precisar)
 */
export const getCategoryImageUrl = (imagePath) => {
  if (!imagePath) return `${IMAGE_BASE_URL}category-placeholder.jpg`;
  if (imagePath.startsWith('http')) return imagePath;
  
  const cleanPath = imagePath.replace(/^\/+/, '');
  if (cleanPath.startsWith('categories/')) {
    return `${IMAGE_BASE_URL}${cleanPath}`;
  }
  return `${IMAGE_BASE_URL}categories/${cleanPath}`;
};