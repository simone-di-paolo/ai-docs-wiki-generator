import os
import requests

API_KEY = None
with open("d:/Developing/Git/Repository/React/ai-docs-wiki-generator/.env.local") as f:
    for line in f:
        if line.startswith("VITE_GEMINI_API_KEY="):
            API_KEY = line.split("=", 1)[1].strip().strip('\"\'')
            break

if not API_KEY:
    print("API KEY non trovata nel file .env.local")
    exit(1)

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"
print(f"Richiesta modelli disponibili a: {url.replace(API_KEY, '***')}")
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print("\nModelli disponibili per la generazione di testo (generateContent):")
    for m in data.get("models", []):
        methods = m.get("supportedGenerationMethods", [])
        if "generateContent" in methods:
            print(f"- {m['name']} (Versione: {m.get('version', 'N/A')})")
else:
    print(f"Errore {response.status_code}: {response.text}")
