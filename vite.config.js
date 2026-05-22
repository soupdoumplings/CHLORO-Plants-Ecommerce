import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ignoredWatchPaths = [
  '**/.git/**',
  '**/node_modules/**',
  '**/dist/**',
  '**/docs/**',
  '**/screenshots/**',
  '**/supabase/**',
  '**/*.log',
  '**/*.doc',
  '**/*.docx',
  '**/~$*',
  '**/chloro_*backup.sql',
]

const stableDevClientCode = `
const sheets = new Map();

const getStyle = (id) => {
  let style = sheets.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    document.head.appendChild(style);
    sheets.set(id, style);
  }
  return style;
};

export const updateStyle = (id, content) => {
  getStyle(id).textContent = content;
};

export const removeStyle = (id) => {
  const style = sheets.get(id);
  if (style) {
    style.remove();
    sheets.delete(id);
  }
};

export const createHotContext = () => ({
  data: {},
  accept: () => {},
  acceptExports: () => {},
  dispose: () => {},
  prune: () => {},
  decline: () => {},
  invalidate: () => {},
  on: () => {},
  off: () => {},
  send: () => {},
  _internal: { updateStyle, removeStyle },
});

export const injectQuery = (url, queryToInject) => {
  if (!queryToInject || /^(?:[a-z]+:)?\\/\\//i.test(url) || url.startsWith('data:')) return url;
  const [withoutHash, hash = ''] = url.split('#');
  const separator = withoutHash.includes('?') ? '&' : '?';
  return withoutHash + separator + queryToInject + (hash ? '#' + hash : '');
};
`;

const stableTabsDevClient = () => ({
  name: 'chloro-stable-tabs-dev-client',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/@vite/client', (_req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'no-store');
      res.end(stableDevClientCode);
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    stableTabsDevClient(),
    react(),
    tailwindcss(),
  ],
  server: {
    hmr: false,
    watch: {
      ignored: ignoredWatchPaths,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 50,
      },
    },
    proxy: {
      '/api/khalti': {
        target: 'https://a.khalti.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/khalti/, ''),
        secure: true,
      },
    }
  }
})
