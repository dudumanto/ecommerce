# 🛒 E-commerce Catalog

**E-commerce Catalog** é um projeto full stack de catálogo de produtos desenvolvido com **React** no front-end e **Laravel** no back-end, totalmente containerizado com **Docker**.

O projeto oferece uma interface para visualização de produtos com paginação e uma área administrativa segura para a gestão do catálogo.

---

## 📍 Guia de Rotas da API

A API está dividida em rotas públicas para visualização e rotas protegidas para gestão do catálogo.

### 🟢 Rotas Públicas (Acesso Livre)

Aqui estão os endpoints que não requerem autenticação.

| Método | Endpoint | Descrição |


| `POST` | `/api/register` | Cadastro de novo usuário |

| `POST` | `/api/login` | Autenticação e obtenção de token |

| `GET` | `/api/products` | Listagem de produtos (Paginada) |

| `GET` | `/api/products/{id}` | Detalhes de um produto específico |

| `GET` | `/api/categories` | Listagem de todas as categorias |

### 🔴 Rotas Protegidas (Requer Token Bearer)

Estes endpoints exigem um token de autenticação válido enviado no cabeçalho da requisição.

**Header Exemplo:** `Authorization: Bearer {seu_token_aqui}`

| Método | Endpoint | Descrição |


| `POST` | `/api/logout` | Invalida o token atual |

| `POST` | `/api/products` | Cadastra um novo produto |

| `PUT` | `/api/products/{id}` | Atualiza dados de um produto |

| `DELETE` | `/api/products/{id}` | Remove um produto do catálogo |

| `POST` | `/api/categories` | Cadastra uma nova categoria |

---

## 🚀 Instalação e Uso

Siga os passos abaixo para rodar o projeto localmente usando o Docker Compose.

### Pré-requisitos
* Ter o [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

### Passos para Instalação

**1. Clone o repositório:**
```bash
git clone (https://github.com/dudumanto/ecommerce)
cd projeto-ecommerce

**2. Entre na pasta do projeto**
```bash
cd projeto-ecommerce
```
**3. Configure o .env do BackEnd, copiar o .env.example, lá estão todas as config do banco ou você pode mudar para sua preferência**
```bash
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=root
```

**4. Subir os Containers**
```bash
docker-compose up -d --build
```
**5. Endereços de Acesso**

```bash
Frontend (React): http://localhost:3000

Backend (API Laravel): http://localhost:8000/api
```


