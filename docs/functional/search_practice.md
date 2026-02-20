# Práctica: Implementación de Búsqueda Simple y Avanzada

## 1. Introducción: Búsqueda Simple vs Avanzada

En el desarrollo de aplicaciones modernas (como GlobalStore), la recuperación de información es el pilar de la experiencia de usuario. Hemos implementado dos niveles de interacción:

### Búsqueda Simple
- **Definición**: Se basa en un único campo de entrada de texto ("Keyword Search").
- **Objetivo**: Descubrimiento rápido. El usuario tiene una idea general (ej. "Coca") y espera resultados inmediatos sin configurar parámetros.
- **Implementación**: Se utiliza una expresión regular `case-insensitive` que busca coincidencias en el nombre del producto.
- **Ventajas**: Baja fricción cognitiva y rapidez.

### Búsqueda Avanzada
- **Definición**: Un conjunto de filtros estructurados que permiten al usuario acotar el universo de datos.
- **Objetivo**: Precisión. El usuario busca algo específico (ej. "Bebidas de Nestlé que cuesten menos de $20").
- **Filtros Implementados**:
    - **Categoría**: Filtrado por taxonomía (Lácteos, Bebidas, etc.).
    - **Empresa/Marca**: Filtrado por el fabricante del producto.
    - **Rango de Precio**: Filtro numérico min/max sobre el precio final al consumidor.
    - **Ordenamiento (Sort)**: Capacidad de reorganizar por relevancia (fecha) o por precio ascendente/descendente.

---

## 2. Herramienta de Búsqueda Elegida y Justificación

Para GlobalStore, se ha elegido **Búsqueda en Base de Datos (MongoDB mediante Expresiones Regulares y Subconsultas)**.

### ¿Por qué esta herramienta?
1. **Consistencia de Datos**: Al buscar directamente en MongoDB, los resultados siempre reflejan el stock actual de las "tienditas" sin retrasos de sincronización (latencia que si tendrían motores externos).
2. **Eficiencia en Costos**: Para un catálogo de 50 a 5,000 productos, un motor como Elasticsearch o Algolia añadiría complejidad técnica e infraestructura innecesaria.
3. **Flexibilidad SQL-like**: MongoDB nos permite filtrar por rangos de precio (`$gte`, `$lte`) de forma nativa mientras realizamos búsquedas por texto en el mismo `query`.

### Enlaces de Investigación Consultados:
- [MongoDB Text Search vs Regex Queries](https://www.mongodb.com/docs/manual/core/link-text-indexes-regex/)
- [Best Practices for Designing RESTful Search APIs](https://stackify.com/rest-api-design-filtering-sorting-paaging/)
- [Usabilidad en Buscadores Avanzados (Nielsen Norman Group)](https://www.nngroup.com/articles/search-filters/)

---

## 3. Diseño del Endpoint de API

### Endpoint Principal: `GET /api/store-products`
*Nota: Este endpoint actúa como nuestro "Search Engine" integrado para el catálogo de tiendas.*

**Parámetros de Consulta (Query Params):**
- `search`: Texto libre para buscar en nombre del producto.
- `category`: String con la categoría exacta.
- `company`: String con la marca/empresa.
- `minPrice` / `maxPrice`: Valores numéricos.
- `sort`: `newest` | `price_asc` | `price_desc`.
- `page` / `limit`: Para paginación.

**Ejemplo de Respuesta Exitosa (JSON):**
```json
{
  "success": true,
  "data": [
    {
      "storeId": { "storeName": "Abarrotes La Esperanza" },
      "productId": { "name": "Coca-Cola 600ml", "category": "Bebidas" },
      "finalPriceCents": 1800,
      "availableQuantity": 25
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## 4. Tabla de Pruebas (Casos de Evidencia)

| # | Caso de Prueba | Parámetros Enviados | Resultado Esperado | Status |
| :- | :--- | :--- | :--- | :--- |
| 1 | Búsqueda por Marca | `search=Bimbo` | Solo productos de marca Bimbo. | ✅ Pass |
| 2 | Filtro Categoría | `category=Bebidas` | Solo refrescos, jugos y agua. | ✅ Pass |
| 3 | Rango de Precio | `minPrice=5&maxPrice=15` | Productos económicos ($5 - $15). | ✅ Pass |
| 4 | Orden por Precio | `sort=price_desc` | Los productos más caros aparecen primero. | ✅ Pass |
| 5 | Sin resultados | `search=iPhone` | Mensaje: "No se encontraron productos disponibles". | ✅ Pass |
| 6 | Paginación | `page=2&limit=10` | Muestra los siguientes 10 productos del catálogo. | ✅ Pass |

---

## 5. Capturas de Evidencia
*(Se adjuntarán capturas de la interfaz en el paso de verificación)*
