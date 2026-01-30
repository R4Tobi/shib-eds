# Shibboleth Embedded Discovery Service

## Umgebung

- 2 Docker Container
  - Service Provider (SP)
  - Embedded Discovery Service (EDS)

Die aktuelle Umgebung stellt über den Service Provider 2 Pfade zur Verfügung:

- `/` , öffentlich
- `/secure`, geschützt durch Shibboleth Authentifizierung

## Funktionsweise

Der `/secure`path leitet zuerst zum EDS um, in dem ein Identity Provider (IdP) ausgewählt werden kann (explizit hier: 9 Hochschullen der Hochschulallianz EU GREEN). Anscließend leitet der EDS zum entsprechenden IdP weiter, sodass eine ANmeldung am SP mit verschiedenen IdPs möglich ist.

## Konfiguration für den Produktivbetrieb

`localhost` muss durch den tatsächlichen hostnamen des Servers ersetzt werden. Das betrifft folgende Dateien:

- `docker-compose.yml`
- `eds/eds/idpselect_config.js`
- `sp/apache/site.conf`
- `sp/shibboleth/shibboleth2.xml`

Zusätzlich muss die Attribute Map an den Service, an dem sich angemeldet werden soll, angepasst werden.

- `sp/shibboleth/attribute-map.xml`

Um Zertifikate zu hinterlegen, muss im `Dockerfile` des SPs das erstellen der self-signed Zertifikate entfernt und mit einem `COPY` Zertifikate hinterlegt werden.
Diese müssen im vorraus in den `sp` Ordner gelegt werden.

```Dockerfile
# if you dont want self-signed certificates, uncomment these lines and provide certificates
COPY sp-key.pem /etc/shibboleth/sp-key.pem
COPY cp-cert.pem /etc/shibboleth/sp-cert.pem
```

## Starten der Umgebung

Die Umgebung kann über `docker compose up --build --detach` gestartet werden.

