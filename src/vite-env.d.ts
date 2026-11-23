/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key — identifies the inbox submissions are delivered to. */
  readonly VITE_WEB3FORMS_KEY: string
  /** CARTO basemaps key for the map tiles (carto.com/basemaps/apikey). */
  readonly VITE_CARTO_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
