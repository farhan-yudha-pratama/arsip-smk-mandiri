# =================================================================
# STAGE 1: Backend Dependencies (Composer Builder)
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
# STAGE 2: Frontend Build (Node.js Builder)
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
# STAGE 3: Final Application (PHP-FPM Staging Environment)
# =================================================================
FROM php:8.3-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
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
    --no-install-recommends

# Install Imagick
RUN pecl install imagick \
    && docker-php-ext-enable imagick

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pgsql zip exif pcntl

# Configure & Install GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . /var/www

COPY --from=node-builder /app/public/build /var/www/public/build

COPY --from=composer-builder /app/vendor /var/www/vendor

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public

EXPOSE 9000
CMD ["php-fpm"]