#!/usr/bin/env bash
set -euo pipefail

SP_HOST="${SP_HOST:-sp.local}"
METADATA_URL="${METADATA_URL:-https://mds.edugain.org/edugain-v2.xml}"

# Enable proxy modules (for EDS reverse proxy)
a2enmod proxy proxy_http >/dev/null

mkdir -p /etc/shibboleth/metadata

# 1) Self-signed TLS for Apache (web)
if [ ! -f /etc/ssl/certs/sp-web.crt ] || [ ! -f /etc/ssl/private/sp-web.key ]; then
  echo "[sp] generating self-signed web cert for ${SP_HOST}"
  openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
    -keyout /etc/ssl/private/sp-web.key \
    -out /etc/ssl/certs/sp-web.crt \
    -subj "/CN=${SP_HOST}" >/dev/null 2>&1
fi

# 2) Self-signed SP cert for SAML signing/encryption
if [ ! -f /etc/shibboleth/sp-cert.pem ] || [ ! -f /etc/shibboleth/sp-key.pem ]; then
  echo "[sp] generating self-signed SP cert for ${SP_HOST}"
  openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
    -keyout /etc/shibboleth/sp-key.pem \
    -out /etc/shibboleth/sp-cert.pem \
    -subj "/CN=${SP_HOST}" >/dev/null 2>&1
  chmod 600 /etc/shibboleth/sp-key.pem

  id _shibd >/dev/null 2>&1 && SHIBUSER=_shibd || SHIBUSER=shibd
  chown root:$SHIBUSER /etc/shibboleth/sp-key.pem /etc/shibboleth/sp-cert.pem
  chmod 640 /etc/shibboleth/sp-key.pem
  chmod 644 /etc/shibboleth/sp-cert.pem
fi

# 3) Fetch eduGAIN metadata (cached file used by shibboleth2.xml)
if [ ! -f /etc/shibboleth/metadata/edugain-v2.xml ]; then
  echo "[sp] downloading metadata from ${METADATA_URL}"
  curl -fsSL "${METADATA_URL}" -o /etc/shibboleth/metadata/edugain-v2.xml
fi

# Start shibd + apache
echo "[sp] starting shibd"
service shibd start

echo "[sp] starting apache foreground"
apachectl -D FOREGROUND
