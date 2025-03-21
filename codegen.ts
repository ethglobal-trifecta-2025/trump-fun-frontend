import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema:
    "https://subgraph.satsuma-prod.com/53c89bfbc8b7/as-team--945605/trump-fun/api",
  documents: ["src/**/*.ts(x)"],
  generates: {
    "src/lib/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
      plugins: [],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
