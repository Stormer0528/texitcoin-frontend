// eslint-disable-next-line import/no-extraneous-dependencies
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://dev.api.minetxc.com/graphql',
  // schema: 'https://8677-107-155-105-218.ngrok-free.appgraphql',
  // schema: 'http://localhost:4000/graphql',
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
