{
  "name": "sasuke-v31-2-shadow-god",
  "version": "31.2.0",
  "description": "SASUKE V31.2 — SHADOW GOD (CORE 77) — Bot WhatsApp alugável por grupo",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "node tests/part1.test.js && node tests/part2.test.js",
    "auditoria": "node tools/auditoria.js"
  },
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "@hapi/boom": "^10.0.1",
    "@whiskeysockets/baileys": "^6.7.9",
    "pino": "^9.0.0",
    "qrcode-terminal": "^0.12.0"
  }
}