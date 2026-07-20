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
