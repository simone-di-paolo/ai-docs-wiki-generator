import os
import requests

API_KEY = ''
with open('d:/Developing/Git/Repository/React/ai-docs-wiki-generator/.env.local') as f:
    for line in f:
        if line.startswith('VITE_GEMINI_API_KEY='):
            API_KEY = line.split('=')[1].strip().strip('\"\'')
            break

url = f'https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}'
response = requests.get(url)
data = response.json()

print(f"--- TUTTI I MODELLI DISPONIBILI ---")
for m in data.get('models', []):
    print(f"- {m['name']}")
