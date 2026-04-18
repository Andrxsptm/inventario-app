import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.producto.count(),
    prisma.proveedor.count(),
    prisma.venta.count(),
    prisma.cliente.count(),
  ])
  console.log({
    users: counts[0],
    productos: counts[1],
    proveedores: counts[2],
    ventas: counts[3],
    clientes: counts[4]
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
