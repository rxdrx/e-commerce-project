## 1. Stack Tecnológico
- **Frontend:** React + TypeScript + Tailwind CSS. (Usa 'Recharts' o 'Chart.js' para los gráficos).
- **Backend API:** Node.js + Express + TypeScript.
- **Data Processing:** Python (Scripts para ETL e ingestión de datos masivos).
- **Base de Datos:** MySQL.

## 2. Base de Datos (Requerimiento Crítico)
Diseña un esquema relacional robusto. No uses solo una tabla. Necesito:
- **Customers:** (id, name, email, region, signup_date).
- **Products:** (id, name, category, cost, price).
- **Orders:** (id, customer_id, status, created_at).
- **OrderItems:** (id, order_id, product_id, quantity, unit_price).
*Nota: Asegúrate de incluir claves foráneas e índices para optimizar consultas.*

## 3. Requerimientos del Script en Python (ETL)
Necesito un script en Python (`etl_ingest.py`) que:
1. Genere o lea un archivo CSV simulado con 10,000 registros de ventas históricas (faker library).
2. Limpie los datos (manejo de errores básicos).
3. Inserte estos datos masivamente en la base de datos MySQL usando la librería `mysql-connector-python` o `SQLAlchemy`.
*Objetivo: Demostrar que puedo manejar Python para scripts de automatización de datos.*

## 4. Requerimientos del Backend (Node/Express)
La API debe servir los datos para el dashboard. NO uses un ORM simple para todo, quiero ver **Raw SQL** o Query Builders complejos para demostrar dominio de SQL.
Endpoints requeridos:
- `GET /api/analytics/kpis`: Debe devolver Total de Ventas, Ingreso Promedio por Usuario (ARPU) y Tasa de Retención.
- `GET /api/analytics/sales-over-time`: Datos agrupados por mes/año para un gráfico de línea.
- `GET /api/products/top-performers`: Los 5 productos más vendidos y su margen de ganancia (Precio - Costo), usando JOINs y GROUP BY.

## 5. Requerimientos del Frontend (Dashboard)
- Crea un Layout con Sidebar y Header.
- **Vista Principal:**
  - 4 "Cards" superiores con los KPIs (Ventas Totales, Pedidos, Clientes Nuevos, Ganancia Neta).
  - Un gráfico de líneas grande mostrando la tendencia de ventas del último año.
  - Una tabla interactiva (DataGrid) con las últimas órdenes, que permita filtrar por "Estado" (Completed, Pending, Cancelled).

## Instrucciones de Entrega
1. Dame primero los scripts SQL para crear las tablas.
2. Dame el script de Python para generar los datos semilla.
3. Dame la estructura del proyecto y los controladores clave del Backend con las queries SQL complejas.
4. Dame los componentes clave del Frontend.
