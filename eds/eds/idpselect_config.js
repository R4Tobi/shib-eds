function IdPSelectUIParms() {
  this.myEntityID = "https://localhost/shibboleth";

  // IMPORTANT: prevent open redirect (EDS 1.2+ uses redirectAllow; returnWhiteList still supported)
  this.redirectAllow = [
    "^https://localhost(:[0-9]+)?/Shibboleth\\.sso/.*$"
  ];

  // Where EDS gets the IdP list from: Shibboleth SP DiscoFeed (JSON)
  this.dataSource = "/Shibboleth.sso/DiscoFeed";

  /* === Basis === */
  this.basePath = "/shibboleth-ds/";
  this.defaultLanguage = "de";
  this.entityIDParam = "entityID";


/* === ERLAUBTE SP-ENTITYIDs === */
  this.allowedSPs = [
    "https://localhost/shibboleth",
    "https://sp.test.local/shibboleth"
  ];

  this.allowSPsWithoutMetadata = true;

  /* === Security === */
  this.returnWhiteList = [
    "^https://localhost(:[0-9]+)?/Shibboleth\\.sso/.*$",
    "^https://sp\\.test\\.local/Shibboleth\\.sso/.*$"
  ];

  /* === Metadata === */
  this.metadataSources = [
    {
      url: "https://mds.edugain.org/edugain-v2.xml",
      type: "xml",
      refreshInterval: 3600
    }
  ];

  /* === UI === */
  this.insertAtDiv = "idpSelect"; 
  this.showList = true;
  this.showSearch = true;
  this.maxResults = 20;
}


