export const typeDefs = `
  type User {
    id: ID!
    email: String!
    payments: [Payment!]!
  }

  type Payment {
    id: ID!
    amount: Int!
    status: String!
    orderId: String!
  }

  type Query {
    users: [User!]!
    payments(userId: ID!): [Payment!]!
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
    createPayment(userId: ID!, amount: Int!): String!
    updatePaymentStatus(orderId: String!, status: String!): Payment!
  }
`;
