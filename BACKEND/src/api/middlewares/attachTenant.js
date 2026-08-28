// middleware attachTenant.js
import prisma from "../config/prisma.js";

export const attachPrismaWithTenant = (req, res, next) => {
  req.prisma = prisma.$extends({
    query: {
      ProductOrder: {
        findMany(args, next) {
          args.args = {
            ...args.args,
            context: { companyId: req.user.companyId },
          };
          return next(args);
        },
        findUnique(args, next) {
          args.args = {
            ...args.args,
            context: { companyId: req.user.companyId },
          };
          return next(args);
        },
        create(args, next) {
          // untuk create, companyId harus tetap diisi
          args.args.data = { ...args.args.data, companyId: req.user.companyId };
          return next(args);
        },
        update(args, next) {
          args.args = {
            ...args.args,
            context: { companyId: req.user.companyId },
          };
          return next(args);
        },
        delete(args, next) {
          args.args = {
            ...args.args,
            context: { companyId: req.user.companyId },
          };
          return next(args);
        },
      },
      // bisa tambahkan model lain: ProductItem, User
    },
  });

  next();
};
