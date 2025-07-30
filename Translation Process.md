## TRANSLATION PROCESS

1. Button Translate is clicked
2. translateButtonClicked function will:
   - Retrieve the db if its not available at sessionStorage, take it from LocalStorage.
   - Send to CallHub / Api Translate
3. Api / Translate:
   - Connects with Ollama and sends back to front end.
   - The object sent back is as:
     {
     translated_text: {
     title: "Artículo de Prueba",
     body: '<div>Hola a todos! Hoy vamos a explorar un concepto fascinante: la entanglement cuántica.<span font-style="bold">La entanglement.</span><div>Es un fenómeno en el que dos o más partículas se unen de manera que compartan su mismo destino, independientemente de la distancia a la que estén separadas.</div></div><br /><div>Esta idea podría parecer un poco compleja al principio, pero vamos a desglosarla paso a paso. Nuestro objetivo es entender cómo funciona esta increíble conexión y sus posibles implicaciones para las tecnologías del futuro, desde ordenadores super-rápidos hasta nuevas formas de comunicación segura.</div><br /><div>Esta idea podría parecer un poco compleja al principio, pero vamos a desglosarla paso a paso. Nuestro objetivo es entender cómo funciona esta increíble conexión y sus posibles implicaciones para las tecnologías del futuro, desde ordenadores super-rápidos hasta nuevas formas de comunicación segura.</div>',
     section: "Reglas importantes:",
     },
     success: true,
     model_used: "llama3.2",
     };
4. translatedButtonClicked function will:

- Check if there is already a translation and save as second translation.
- Save translation as:
  articleContent.push({ type: "es-title", content: title });
  articleContent.push({ type: "es-body", content: body });
  articleContent.push({ type: "es-section", content: section });
- Trigger setTranslationReady which should trigger useTranslatedArticleDraft function

5. useTranslatedArticleDraft function will:

- Retrieve from the Title and Body
- Update Refs
  // CHECK if it will trigger
