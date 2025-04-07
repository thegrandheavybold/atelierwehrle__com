import "decap-cms-app";

// CMS initialisieren
CMS.init();

// Beispiel: Eine Vorschau-Template-Registrierung (falls gewünscht)
CMS.registerPreviewTemplate("blog", ({ entry }) => {
  const data = entry.getIn(["data"]).toJS();
  return `<h1>${data.title}</h1><p>${data.body}</p>`;
});
