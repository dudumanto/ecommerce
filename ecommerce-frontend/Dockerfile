# Estágio de build
FROM node:18-alpine AS build

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências (usando npm ci para maior consistência)
RUN npm ci || npm install

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos construídos
COPY --from=build /app/build /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]