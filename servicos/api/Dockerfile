FROM php:8.3-apache

ARG user
ARG uid

RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install mbstring exif pcntl bcmath gd pdo_pgsql pgsql
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

WORKDIR /var/www/html

COPY /src/composer.json /var/www/html
RUN composer install --no-dev --no-scripts --no-autoloader

COPY educara.apache.conf /etc/apache2/sites-available
RUN a2enmod rewrite
RUN a2dissite 000-default.conf && a2ensite educara.apache.conf

# Copiar arquivo de configuração customizado do PHP
COPY php.ini /usr/local/etc/php/php.ini

# Criar diretório de logs com permissões apropriadas
RUN mkdir -p /var/www/html/storage/logs && \
    touch /var/www/html/storage/logs/php-error.log && \
    chown -R www-data:www-data /var/www/html/storage/logs && \
    chmod -R 775 /var/www/html/storage/logs

RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

USER $user