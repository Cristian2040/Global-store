# Práctica: Búsqueda Simple y Avanzada — Reporte de Investigación

---

## 1. Diferencia entre Búsqueda Simple y Avanzada

| Característica | Búsqueda Simple | Búsqueda Avanzada |
|---|---|---|
| **Entrada** | Un campo de texto libre (`q`) | Múltiples campos estructurados |
| **Objetivo** | Descubrimiento rápido | Precisión y filtrado fino |
| **Fricción** | Baja | Media (requiere configurar filtros) |
| **Ejemplo** | `q=Coca` | `category=Bebidas&minPrice=5&maxPrice=20&sort=price_asc` |

**Búsqueda Simple** es ideal cuando el usuario tiene una idea vaga del producto. Se implementa como una expresión regular `case-insensitive` sobre el nombre del producto, permitiendo encontrar resultados parciales (ej. "Coca" devuelve "Coca-Cola 600ml" y "Coca-Cola 355ml").

**Búsqueda Avanzada** combina múltiples criterios en la misma consulta: taxonomía (categoría), origen (empresa/marca), precio (rango min/max) y ordenamiento. Esto permite reducir el catálogo de 300+ registros a una selección muy acotada.

---

## 2. Herramienta Elegida y Justificación

**Tecnología: MongoDB con Regex + índices de campo**

### ¿Por qué no Elasticsearch o Algolia?
- Para un catálogo de **50–5,000 productos**, sincronizar un motor externo introduce latencia y costo sin beneficio real.
- MongoDB ya es la base de datos principal del proyecto, evitando doble infraestructura.

### Ventajas de MongoDB para este caso
- **Regex `$options: 'i'`**: búsqueda de texto insensible a mayúsculas sin índice especial.
- **`$gte`/`$lte`**: filtrado nativo de rangos numéricos en el mismo pipeline.
- **Consultas compuestas**: combinar filtros de texto + precio + ordenamiento en un solo `find()`.
- **Populate**: traer datos del producto y la tienda en una sola operación sin joins externos.

### Referencias Consultadas
- [MongoDB Regex Queries — Documentación oficial](https://www.mongodb.com/docs/manual/reference/operator/query/regex/)
- [REST API Design: Filtering, Sorting & Pagination — Stackify](https://stackify.com/rest-api-design/)
- [Search Filters & Facets UX — Nielsen Norman Group](https://www.nngroup.com/articles/search-filters/)
- [MDN: URLSearchParams — Frontend query building](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

---

## 3. Diseño del Endpoint

### `GET /api/store-products` (público)  
### Alias: `GET /api/search` (público)

#### Parámetros de Consulta

| Parámetro | Tipo | Descripción |
|---|---|---|
| `q` | string (max 100 chars) | Búsqueda simple por nombre del producto |
| `category` | string | Filtro por categoría exacta |
| `company` | string | Filtro por empresa/marca |
| `minPrice` | number (pesos) | Precio mínimo |
| `maxPrice` | number (pesos) | Precio máximo |
| `sort` | `newest` \| `price_asc` \| `price_desc` | Ordenamiento |
| `page` | integer ≥ 1 | Página (default: 1) |
| `limit` | integer 1–50 | Items por página (default: 20, **máximo: 50**) |

#### Respuesta Exitosa (`200`)

```json
{
  "success": true,
  "message": "Productos obtenidos correctamente",
  "data": [
    {
      "_id": "...",
      "storeId": { "storeName": "Abarrotes La Esperanza" },
      "productId": { "name": "Coca-Cola 600ml", "category": "Bebidas", "company": "Coca-Cola Company", "image": "https://..." },
      "finalPriceCents": 2029,
      "availableQuantity": 38
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 15,
    "totalPages": 8
  }
}
```

#### Errores

| Caso | Status | Respuesta |
|---|---|---|
| `minPrice` no es número | `400` | `{ "success": false, "message": "minPrice must be a valid number" }` |
| `minPrice > maxPrice` | `400` | `{ "success": false, "message": "minPrice cannot be greater than maxPrice" }` |
| `page` no es entero positivo | `400` | `{ "success": false, "message": "El parámetro \"page\" debe ser un número entero positivo." }` |
| Sin resultados | `200` | `{ "data": [], "pagination": { "total": 0, "totalPages": 0 } }` |

---

## 4. Seguridad

- **`q` truncado a 100 caracteres** en el servicio antes de construir la regex.
- **`limit` máximo 50** — se forza con `Math.min(50, limit)`.
- **No se concatenan strings a la query** — se usa el objeto Mongoose `{$regex, $options}` que es seguro contra inyección.
- **Parámetros numéricos** validados con `Number()` e `isNaN()` antes de llegar a la DB.

---

## 5. Tabla de Pruebas — Evidencia

| # | Caso | Parámetros | Resultado Esperado | Verificado |
|---|---|---|---|---|
| 1 | **Búsqueda simple** (keyword) | `q=Coca&limit=2` | 2 items de Coca-Cola, total=15, totalPages=8 | ✅ 200 OK |
| 2 | **Filtro categoría** (avanzada) | `category=Botanas&sort=price_desc` | Solo botanas, ordenadas de mayor a menor precio | ✅ 200 OK |
| 3 | **Filtro precio** + sort | `minPrice=5&maxPrice=20&sort=price_asc` | Items entre $5–$20, primero el más barato | ✅ 200 OK |
| 4 | **Paginación** | `page=2&limit=5` | 5 items de la página 2, totalPages=60 | ✅ 200 OK |
| 5 | **Sin resultados** | `q=zzznoresult` | `data=[]`, `total=0`, `totalPages=0` | ✅ 200 OK |
| 6 | **Parámetro inválido** | `minPrice=abc` | 400 con mensaje claro | ✅ 400 Error |
| 7 | **Límite máximo** (seguridad) | `limit=999` | Retorna máximo 50 items por página | ✅ Capped a 50 |
