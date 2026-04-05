// prisma/seed.js  — datos iniciales para desarrollo
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@invensmart.com' },
    update: {},
    create: {
      email: 'admin@invensmart.com',
      password: await bcrypt.hash('admin123', 10),
      nombre: 'Administrador',
      rol: 'ADMINISTRADOR',
    },
  })

  // Vendedor demo
  await prisma.user.upsert({
    where: { email: 'vendedor@invensmart.com' },
    update: {},
    create: {
      email: 'vendedor@invensmart.com',
      password: await bcrypt.hash('vendedor123', 10),
      nombre: 'Vendedor Demo',
      rol: 'VENDEDOR',
    },
  })

  // Proveedor demo
  const prov = await prisma.proveedor.create({
    data: { nombre: 'Distribuidora Central', telefono: '3001234567', correo: 'contacto@distcentral.com' },
  })

  // Productos demo
  await prisma.producto.createMany({
    data: [
      { nombre: 'Café 500g',        precioCompra: 8,  precioVenta: 14,  stockActual: 12, stockMinimo: 10, proveedorId: prov.id },
      { nombre: 'Mantequilla 250g', precioCompra: 3,  precioVenta: 5,   stockActual: 3,  stockMinimo: 8,  proveedorId: prov.id },
      { nombre: 'Huevos x12',       precioCompra: 4,  precioVenta: 6,   stockActual: 5,  stockMinimo: 10, proveedorId: prov.id },
      { nombre: 'Chicharrón 200g',  precioCompra: 2,  precioVenta: 3.5, stockActual: 2,  stockMinimo: 6,  proveedorId: prov.id },
      { nombre: 'Arroz 1kg',        precioCompra: 1.5,precioVenta: 2.5, stockActual: 30, stockMinimo: 15, proveedorId: prov.id },
    ],
  })

  console.log('✅ Seed completado')
  console.log('   admin@invensmart.com / admin123')
  console.log('   vendedor@invensmart.com / vendedor123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
