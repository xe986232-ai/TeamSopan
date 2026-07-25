const { Config } = require("@remotion/cli/config");
const { enableTailwind } = require("@remotion/tailwind");

// Supaya class Tailwind (mis. `font-display`, `backdrop-blur-xl`, dst) yang
// dipakai oleh komponen bersama (TiktokStage / MusicPlayerCard) ke-compile
// dengan benar baik lewat `npx remotion studio` (preview lokal) maupun lewat
// bundle() yang dipanggil dari API route render (lib/remotion-bundle.js).
Config.overrideWebpackConfig((currentConfiguration) => enableTailwind(currentConfiguration));
