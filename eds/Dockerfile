FROM nginx:stable

ENV EDS_VERSION=1.2.2

# nginx auf 8080
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Download & install EDS
RUN apt-get update && apt-get install -y curl unzip \
 && mkdir -p /usr/share/nginx/html \
 && curl -fsSL \
    https://shibboleth.net/downloads/embedded-discovery-service/${EDS_VERSION}/shibboleth-embedded-ds-${EDS_VERSION}.zip \
    -o /tmp/eds.zip \
 && unzip /tmp/eds.zip -d /usr/share/nginx/html \
 && mv /usr/share/nginx/html/shibboleth-embedded-ds-${EDS_VERSION}/* /usr/share/nginx/html/ \
 && rm -rf /tmp/eds.zip \
 && apt-get purge -y unzip curl \
 && rm -rf /var/lib/apt/lists/*

# Custom config
COPY ./eds/idpselect_config.js /usr/share/nginx/html/idpselect_config.js
COPY ./eds/idpselect.css /usr/share/nginx/html/css/idpselect.css
COPY ./eds/index.html /usr/share/nginx/html/index.html

EXPOSE 8080
