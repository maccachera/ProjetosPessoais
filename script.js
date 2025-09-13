
const translations = {
  pt: {
    projects: 'Projetos',
    problem: 'problema',
    about: 'sobre',
    chooseLanguage: 'Escolha o idioma:'
  }
};

/**
 * Atualiza o texto dos elementos na página com base no idioma selecionado.
 * @param {string} lang - O código do idioma (ex: 'en', 'es').
 */
function updatePageText(lang) {
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
}

/**
 * Busca as traduções da API para um novo idioma.
 * @param {string} lang - O código do idioma para o qual traduzir.
 */
async function fetchTranslationsFor(lang) {
  
  translations[lang] = {};

  
  const keys = Object.keys(translations.pt);

  
  await Promise.all(keys.map(async (key) => {
    const textToTranslate = translations.pt[key];
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=pt|${lang}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        
        translations[lang][key] = data.responseData.translatedText;
      } else {
        
        translations[lang][key] = textToTranslate;
      }
    } catch (error) {
      console.error('Erro ao traduzir:', error);
      
      translations[lang][key] = textToTranslate;
    }
  }));
}


async function traduzirPagina() {
  const selectedLang = document.getElementById('idioma').value;

  
  if (!translations[selectedLang]) {
    console.log(`Buscando traduções para ${selectedLang}... 🌎`);
    await fetchTranslationsFor(selectedLang);
    console.log('Traduções carregadas!');
  }

  
  updatePageText(selectedLang);
}