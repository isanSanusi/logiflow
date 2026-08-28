// config/prisma.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware Prisma: filter otomatis berdasarkan companyId
// prisma.$use(async (params, next) => {
//   const tenantModels = ["ProductOrder", "ProductItem", "User"]; // model yang perlu tenant filter

//   Hanya apply pada model yang ada di tenantModels
//   if (tenantModels.includes(params.model)) {
//     Hanya untuk query yang ada where
//     if (!params.args) params.args = {};
//     if (!params.args.where) params.args.where = {};

//     cek context.companyId, kalau ada tambahkan filter
//     if (params?.args?.context?.companyId) {
//       if (!params.args.where.AND) params.args.where.AND = [];
//       params.args.where.AND.push({ companyId: params.args.context.companyId });
//     }
//   }

//   return next(params);
// });

export default prisma;
