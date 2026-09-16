# =================================================================
# STAGE 1: Backend Dependencies
# =================================================================
FROM composer:latest as composer-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# =================================================================
# STAGE 2: Frontend Build
# =================================================================
FROM node:22-alpine as node-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_BINDUK_APP_URL
ENV VITE_BINDUK_APP_URL=${VITE_BINDUK_APP_URL}
RUN npm run build

# =================================================================
# STAGE 3: Final Web Application (Nginx + PHP-FPM)
# =================================================================
FROM php:8.3-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    unzip \
    git \
    curl \
    libzip-dev \
    libpq-dev \
    libmagickwand-dev \
    libreoffice \
    fonts-liberation \
    fontconfig \
    --no-install-recommends \
    && pecl install imagick \
    && docker-php-ext-enable imagick \
    && docker-php-ext-install pdo_pgsql pgsql zip exif pcntl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Konfigurasi Nginx untuk Laravel
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /var/www/public; \
    index index.php; \
    client_max_body_size 50M; \
    location / { \
    try_files $uri $uri/ /index.php?$query_string; \
    } \
    location ~ \.php$ { \
    include fastcgi_params; \
    fastcgi_pass 127.0.0.1:9000; \
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \
    } \
    }' > /etc/nginx/sites-available/default

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY . /var/www
COPY --from=node-builder /app/public/build /var/www/public/build
COPY --from=composer-builder /app/vendor /var/www/vendor

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public

EXPOSE 80

# Start PHP-FPM dan Nginx
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]