import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.dokedu.dev/query",
  documents: ["src/**/*.{vue,ts}"],
  ignoreNoDocuments: true, // for better experience with the watcher
  watch: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
      },
      plugins: [],
    },
  },
};

export default config;
