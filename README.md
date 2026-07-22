¿Qué hace? (en una frase) Administra productos, clientes, ventas y stock de forma que todo esté conectado y actualizado en tiempo real. Los 4 pilares

📦 Productos Podés cargar lo que vendés con nombre, precio, código, y stock. Cuando alguien compra, el stock se descuenta solo. Cuando te devuelven algo, el stock se recompone solo. Nunca más vas a vender algo que no tenés.
👥 Clientes Podés guardar quiénes te compran, su historial, sus datos de contacto. Cuando un cliente llame, en 2 segundos sabés qué compró, cuándo, y por cuánto.
🧾 Ventas Podés registrar cada venta con todos sus productos, el total, y el método de pago. Después podés ver cuánto vendiste hoy, este mes, o filtrar por fechas. Si una venta se cancela, el stock vuelve solo — no tenés que acordarte de hacerlo a mano.
📊 Dashboard (el panel de control) Apenas abrís el sistema, ves una sola pantalla con:
Total de productos que tenés
Cuántos clientes registraste
Ventas de hoy y cuánta plata entró
Qué productos tienen stock bajo (para que no te agarre de sorpresa)
Últimas ventas (los movimientos más recientes)

# Frontend — Minimalist ERP

Aplicación SPA construida con Angular 21 (standalone components).

## Estructura

```
src/app/
├── models/           # Interfaces y tipos TypeScript
│   ├── product.model.ts
│   ├── category.model.ts
│   ├── customer.model.ts
│   ├── sale.model.ts
│   └── stock-movement.ts
├── services/         # Servicios HTTP (1 por agregado)
│   ├── product.service.ts
│   ├── category.service.ts
│   ├── customer.service.ts
│   ├── sale.service.ts
│   └── stock-movement.service.ts
├── pages/            # Componentes de página (standalone)
│   ├── dashboard/
│   ├── products/     # product-list, product-form, product-detail
│   ├── sales/        # sale-list, sale-form
│   └── customers/    # customer-list, customer-form
└── shared/           # Componentes compartidos
```

## Servicios

Cada service encapsula las llamadas HTTP a un endpoint del backend y devuelve `Observables` tipados.

| Service | Endpoint base |
|---------|--------------|
| `ProductService` | `/api/products` |
| `CategoryService` | `/api/categories` |
| `CustomerService` | `/api/customers` |
| `SaleService` | `/api/sales` |
| `StockMovementService` | `/api/stock-movements` |

## Desarrollo

```bash
ng serve          # servidor de desarrollo → http://localhost:4200
ng build          # build de producción → /dist
```

La API del backend debe estar corriendo en `http://localhost:8080`.
