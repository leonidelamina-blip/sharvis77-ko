const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const log = require('./src/utils/log');

process.on('uncaughtException', (e) => log.error('uncaughtException:', e.stack || e.message));
process.on('unhandledRejection', (e) => log.error('unhandledRejection:', e?.stack || e));

function validarConfig() {
  const dig = (n) => /^\d{10,15}$/.test(String(n));
  if (!dig(config.bot.numeroIntl)) throw new Error('config.bot.numeroIntl inválido (só dígitos, sem +).');
  if (!dig(config.dono.numeroIntl)) throw new Error('config.dono.numeroIntl inválido (só dígitos, sem +).');
  if (config.bot.numeroIntl === config.dono.numeroIntl)
    throw new Error('Número do bot e do dono NÃO podem ser iguais.');
  const modo = (process.env.SASUKE_MODO || config.conexao.modo || '').toLowerCase();
  if (!['pairing', 'qr', 'ambos'].includes(modo))
    throw new Error("conexao.modo deve ser 'pairing', 'qr' ou 'ambos'.");
}

async function main() {
  validarConfig();
  for (const d of ['auth', 'database', 'assets/anime'])
    fs.mkdirSync(path.join(__dirname, d), { recursive: true });

  const db = require('./src/database/db');
  db.init();
  db.startBackups();
  require('./src/handlers/commandLoader').load();

  const scheduler = require('./src/services/messageScheduler');
  const shutdown = async () => {
    try { await scheduler.esvaziar(3000); } catch (_) {}
    db.flushAll();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  log.info(`${config.bot.nome} • ${config.bot.core}`);
  await require('./src/services/connection').startSock();
}

main().catch((e) => { log.error(e.message); process.exit(1); });