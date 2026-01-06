// Shim for global.crypto - needed by object-hash used in react-easy-chart
// This file should be injected into esbuild's pre-bundling
if (typeof globalThis !== 'undefined' && typeof window !== 'undefined' && !globalThis.crypto) {
  globalThis.crypto = window.crypto;
}

