import fs from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = 'AIzaSyAh4qDBrmF7VKQhq9ZAuiJqqnCVQy8Y25k';
const sourceLanguage = 'Português (Brasil)';
const sourceFile = './messages/pt.json';
const targets = [
  { code: 'es', name: 'Espanhol' },
  { code: 'ko', name: 'Coreano' },
  { code: 'de', name: 'Alemão' },
  { code: 'fr', name: 'Francês' },
  { code: 'ru', name: 'Russo' },
  { code: 'tr', name: 'Turco' },
  { code: 'zh', name: 'Chinês (Simplificado)' },
  { code: 'ja', name: 'Japonês' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function translateText(text, targetLangName) {
  if (!text || typeof text !== 'string') return text;
  const prompt = `Traduza o seguinte texto de "${sourceLanguage}" para "${targetLangName}". Retorne apenas o texto traduzido, sem nenhuma explicação ou formatação extra:\n\n"${text}"`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error(`Erro ao traduzir "${text}" para ${targetLangName}:`, error.message);
    // Em caso de erro de limite, espere um pouco mais antes de continuar - testando com 10 segundos 
    if (error.message.includes('429')) {
        console.log('Limite de taxa atingido, esperando 10 segundos...');
        await delay(10000);
    }
    return text;
  }
}

async function translateObject(obj, targetLangName) {
    const newObj = {};
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
            newObj[key] = await translateObject(value, targetLangName);
        } else if (typeof value === 'string') {
            console.log(`Traduzindo "${value}" para [${targetLangName.toUpperCase()}]...`);
            newObj[key] = await translateText(value, targetLangName);
            
            // Deley de 5 SEGUNDOS após cada tradução pq o tempo limite é 15 por minuto (1 a cada 4 segundos)
            await delay(5000); 
            
        } else {
            newObj[key] = value;
        }
    }
    return newObj;
}

async function run() {
  try {
    console.log(`Lendo o arquivo de origem: ${sourceFile}`);
    const sourceContent = await fs.readFile(sourceFile, 'utf8');
    const sourceJson = JSON.parse(sourceContent);
    for (const lang of targets) {
        console.log(`\n--- GERANDO ARQUIVO PARA O IDIOMA: ${lang.name.toUpperCase()} ---`);
        const translatedJson = await translateObject(sourceJson, lang.name);
        const targetFile = `./messages/${lang.code}.json`;
        await fs.writeFile(targetFile, JSON.stringify(translatedJson, null, 2), 'utf8');
        console.log(`✅ Arquivo ${targetFile} gerado com sucesso!`);
    }
    console.log('\nTradução de todos os idiomas concluída!');
  } catch(error) {
    console.error("❌ Ocorreu um erro geral:", error);
  }
}

run();