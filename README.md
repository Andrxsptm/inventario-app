# 📦 InvenSmart — Sistema de Gestión de Inventario

Aplicación web fullstack basada en los procesos del documento  
**Procesos_Requisitos_v2.xlsx** (RUP + ISO/IEC 25010).

---

## 🛠️ Tech Stack

| Capa       | Tecnología                              |
|------------|------------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS           |
| Gráficas   | Recharts                                 |
| Routing    | React Router DOM v6                      |
| Estado     | Zustand (auth persistente)               |
| HTTP       | Axios (con interceptor JWT)              |
| Backend    | Node.js + Express                        |
| ORM        | Prisma                                   |
| Base Datos | SQLite (dev) → PostgreSQL (prod)         |
| Auth       | JWT + bcrypt                             |
| Validación | Zod                                      |

---

## 📁 Estructura

```
inventario-app/
├── frontend/          ← React + Vite
│   └── src/
│       ├── pages/     ← Dashboard, Login, Ventas, Productos…
│       ├── components/
│       │   ├── layout/ ← Sidebar, Navbar, AppLayout
│       │   └── ui/     ← Componentes reutilizables
│       ├── store/     ← Zustand (authStore)
│       ├── services/  ← api.js (Axios)
│       └── hooks/     ← Custom hooks
│
└── backend/           ← Express API REST
    ├── src/
    │   ├── routes/    ← auth, productos, ventas, compras…
    │   ├── controllers/
    │   └── middleware/ ← JWT, roles
    └── prisma/
        ├── schema.prisma  ← Modelos de BD
        └── seed.js        ← Datos iniciales
```

---

## 🚀 Instalación y arranque

### 1. Backend

```bash
cd backend
cp .env.example .env          # edita JWT_SECRET si quieres
npm install
npx prisma migrate dev --name init
node prisma/seed.js           # carga datos demo
npm run dev                   # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                   # http://localhost:3000
```

---

## 👤 Usuarios de prueba (seed)

| Rol           | Email                      | Contraseña    |
|---------------|----------------------------|---------------|
| Administrador | admin@invensmart.com       | admin123      |
| Vendedor      | vendedor@invensmart.com    | vendedor123   |

---

## 📋 Módulos implementados

| #  | Proceso                  | Estado        |
|----|--------------------------|---------------|
| 1  | Autenticación por roles  | ✅ Backend + UI |
| 2  | Gestión de proveedores   | ✅ Backend      |
| 3  | Catálogo de productos    | ✅ Backend      |
| 4  | Inventario + alertas     | ✅ Backend + UI |
| 5  | Órdenes de compra        | ✅ Backend      |
| 6  | Registro de ventas       | ✅ Backend      |
| 7  | Comprobante de venta     | 🔧 Pendiente   |
| 8  | Gestión de clientes      | ✅ Backend      |
| 9  | Reportes y dashboard     | ✅ Backend + UI |

---

## 🔌 API Endpoints principales

```
POST   /api/auth/login
GET    /api/productos
POST   /api/productos
PUT    /api/productos/:id
GET    /api/inventario          ← con clasificación AGOTADO/CRÍTICO/BAJO/OK
GET    /api/ventas
POST   /api/ventas              ← descuenta stock automáticamente
PUT    /api/ventas/:id/anular
GET    /api/compras
POST   /api/compras
PUT    /api/compras/:id/recibir ← actualiza stock al recibir
GET    /api/clientes
GET    /api/proveedores
GET    /api/reportes/dashboard  ← datos para el dashboard
GET    /api/reportes/ventas?desde=&hasta=
```
