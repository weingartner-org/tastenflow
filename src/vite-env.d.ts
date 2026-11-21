/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND?: "mock" | "pocketbase";
  readonly VITE_POCKETBASE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.json" {
  const value: any;
  export default value;
}
