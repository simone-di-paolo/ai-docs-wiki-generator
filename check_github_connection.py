import os
import requests
import json

# Caricamento variabili da .env.local
env_path = r"d:\Developing\Git\Repository\React\ai-docs-wiki-generator\.env.local"
config = {}
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            if "=" in line:
                key, value = line.split("=", 1)
                config[key.strip()] = value.strip().strip('"\'')

TOKEN = config.get("GITHUB_MODELS_TOKEN")
ENDPOINT = config.get("GITHUB_MODELS_ENDPOINT", "https://models.inference.ai.azure.com")
MODEL = config.get("GITHUB_MODEL_NAME", "gpt-4o")

if not TOKEN:
    print("❌ ERRORE: GITHUB_MODELS_TOKEN non trovato in .env.local")
    exit(1)

print(f"--- Test Connessione GitHub Models ---")
print(f"Modello: {MODEL}")
print(f"Endpoint: {ENDPOINT}")

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

payload = {
    "messages": [
        {"role": "system", "content": "Sei un assistente tecnico senior."},
        {"role": "user", "content": "Ciao! Sei attivo su GitHub Enterprise? Rispondi in modo breve."}
    ],
    "model": MODEL,
    "temperature": 0.7,
    "max_tokens": 100
}

try:
    response = requests.post(f"{ENDPOINT}/chat/completions", headers=headers, json=payload)
    response.raise_for_status()
    result = response.json()
    print("\n✅ RISPOSTA DALL'AI:")
    print(result["choices"][0]["message"]["content"])
except Exception as e:
    print(f"\n❌ ERRORE DURANTE LA CHIAMATA:")
    print(str(e))
    if hasattr(e, 'response') and e.response is not None:
        print(f"Dettagli: {e.response.text}")
