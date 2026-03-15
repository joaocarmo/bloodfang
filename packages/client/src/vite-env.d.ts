declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_SERVER_URL?: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
