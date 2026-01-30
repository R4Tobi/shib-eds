FROM debian:bookworm

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y \
 && apt-get install -y --no-install-recommends \
    apache2 \
    libapache2-mod-shib \
    shibboleth-sp-common \
    shibboleth-sp-utils \
    openssl \
    ca-certificates \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Apache modules
RUN a2enmod ssl headers shib

# Copy configs
COPY apache/site.conf /etc/apache2/sites-available/000-default.conf
COPY shibboleth/shibboleth2.xml /etc/shibboleth/shibboleth2.xml
COPY shibboleth/attribute-map.xml /etc/shibboleth/attribute-map.xml

# Minimal content
RUN mkdir -p /var/www/html/secure \
 && printf "PUBLIC OK\n" > /var/www/html/index.html \
 && printf "SHIB OK - protected\n" > /var/www/html/secure/index.html

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443
ENTRYPOINT ["/entrypoint.sh"]
