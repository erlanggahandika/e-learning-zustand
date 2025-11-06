import express from "express";
import { ApolloServer } from "apollo-server-express";

import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

dotenv.config();

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
