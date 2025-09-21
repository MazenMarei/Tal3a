/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OWNERS_CANISTER_ID: string;
  readonly VITE_USER_CANISTER_ID: string;
  readonly VITE_EVENT_CANISTER_ID: string;
  readonly VITE_SOCIAL_CANISTER_ID: string;
  readonly VITE_ICRC1_LEDGER_CANISTER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
