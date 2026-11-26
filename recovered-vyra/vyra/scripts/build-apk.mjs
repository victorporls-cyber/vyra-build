// Gera o VYRA.apk (debug, já instalável) com Capacitor + Android.
// Requisitos: Node 22+, Java 21 e Android SDK (ANDROID_HOME). Uso: npm run apk
import { execSync } from 'node:child_process';
import { existsSync, copyFileSync, rmSync } from 'node:fs';

const major = Number(process.versions.node.split('.')[0]);
if (major < 22) { console.error(`Precisa de Node 22 ou mais novo (você tem ${process.versions.node}).`); process.exit(1); }

const run = (cmd, opts = {}) => { console.log(`\n> ${cmd}`); execSync(cmd, { stdio: 'inherit', ...opts }); };
const win = process.platform === 'win32';

run('node scripts/copy-web.mjs', { env: { ...process.env, VYRA_REQUIRE_FONTS: '1' } });
if (!existsSync('android')) run('npx cap add android');
run('npx --yes @capacitor/assets generate --android --iconBackgroundColor "#0a0910" --splashBackgroundColor "#0a0910"');
run('npx cap sync android');
run(win ? 'gradlew.bat assembleDebug' : './gradlew assembleDebug', { cwd: 'android' });

const built = 'android/app/build/outputs/apk/debug/app-debug.apk';
if (!existsSync(built)) { console.error('O APK não foi encontrado em ' + built); process.exit(1); }
rmSync('VYRA.apk', { force: true });
copyFileSync(built, 'VYRA.apk');
console.log('\nPronto: VYRA.apk');
