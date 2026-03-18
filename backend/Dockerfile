FROM php:8.2-fpm

# Instalar dependências
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    netcat-openbsd \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/backend

# Criar script de entrada
RUN echo '#!/bin/bash\n\
\n\
echo "🚀 Iniciando container...\n"\n\
\n\
# Aguardar banco de dados ficar pronto\necho "⏳ Aguardando MySQL..."\n\
while ! nc -z db 3306; do\n\
  sleep 1\n\
done\n\
echo "✅ MySQL pronto!\n"\n\
\n\
# Verificar se é primeira execução (vendor não existe)\n\
if [ ! -d "vendor" ]; then\n\
    echo "📦 Instalando dependências..."\n\
    composer install --no-interaction\n\
fi\n\
\n\
# Gerar key se não existir no .env\n\
if [ ! -f ".env" ]; then\n\
    echo "📝 Criando arquivo .env..."\n\
    cp .env.example .env\n\
fi\n\
\n\
# Verificar se a APP_KEY está vazia\n\
APP_KEY=$(grep APP_KEY .env | cut -d "=" -f2)\n\
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then\n\
    echo "🔑 Gerando chave da aplicação..."\n\
    php artisan key:generate --force\n\
fi\n\
\n\
# Executar migrações\necho "📦 Executando migrações..."\n\
php artisan migrate --force\n\
\n\
# Opcional: Popular banco com dados de teste (ambiente desenvolvimento)\n\
if [ "$APP_ENV" = "local" ] || [ "$APP_ENV" = "development" ]; then\n\
    echo "🌱 Populando banco com dados de teste..."\n\
    php artisan db:seed --force\n\
fi\n\
\n\
# Criar link para storage\necho "🔗 Criando link storage..."\n\
php artisan storage:link || true\n\
\n\
# Limpar cache\necho "🧹 Limpando cache..."\n\
php artisan config:clear\n\
php artisan route:clear\n\
php artisan view:clear\n\
\n\
echo "✅ Setup completo! Iniciando PHP-FPM...\n"\n\
\n\
exec php-fpm' > /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

# Definir entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["php-fpm"]
