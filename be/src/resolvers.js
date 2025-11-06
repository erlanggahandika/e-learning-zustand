import { prisma, snap } from "./context.js";

export const resolvers = {
  Query: {
    users: () => prisma.user.findMany({ include: { payments: true } }),
    payments: (_, { userId }) =>
      prisma.payment.findMany({ where: { userId: Number(userId) } }),
  },
  Mutation: {
    createUser: (_, { email, password }) =>
      prisma.user.create({ data: { email, password } }),

    createPayment: async (_, { userId, amount }) => {
  const orderId = `ORDER-${Date.now()}`;

  await prisma.payment.create({
    data: { amount, status: "pending", orderId, userId: Number(userId) },
  });

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      email: "user@example.com",
    },
  });

  return transaction.redirect_url; // ✅ return hanya URL
    },


    updatePaymentStatus: (_, { orderId, status }) =>
      prisma.payment.update({
        where: { orderId },
        data: { status },
      }),
  },
};
