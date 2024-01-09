import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "http://localhost:1323/query",
  documents: "src/gql/**/*.graphql",
  watch: true,
  config: {
    scalars: {
      Long: "number"
    },
    defaultScalarType: "never",
    useTypeImports: true
  },
  generates: {
    "src/gql/schema.ts": {
      plugins: ["typescript", "typescript-urql-graphcache"]
    },
    "src/gql/": {
      preset: "near-operation-file",
      presetConfig: {
        baseTypesPath: "schema.ts",
        extension: ".ts",
        config: {
          preResolveTypes: false
        }
      },
      plugins: ["typescript-operations", "typescript-vue-urql"]
    },
    "src/gql/introspection.ts": {
      plugins: ["urql-introspection"]
    },
    "src/gql/schema.graphql": {
      plugins: ["schema-ast"]
    }
  }
}
export default config
