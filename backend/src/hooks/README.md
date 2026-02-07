# Hooks y Seeds - GlobalStore Backend

## 📁 Estructura

### `/src/hooks`
Contiene **Mongoose middleware** (hooks) que se ejecutan automáticamente en ciertos eventos del ciclo de vida de los modelos.

**Archivo:** `modelHooks.js`

**Hooks disponibles:**
- `hashPasswordBeforeSave` - Hashea contraseñas automáticamente
- `updateTimestamps` - Actualiza timestamps
- `logOperation` - Logging de operaciones
- `validateBeforeSave` - Validaciones custom
- `softDeleteMiddleware` - Soft delete

**Uso en modelos:**
```javascript
const { hashPasswordBeforeSave } = require('../hooks/modelHooks');

userSchema.pre('save', hashPasswordBeforeSave);
```

### `/src/seeds`
Contiene **scripts para poblar la base de datos** con datos de prueba.

**Archivo:** `seedDatabase.js`

**Datos que crea:**
- ✅ 4 usuarios (admin, store, supplier, customer)
- ✅ 1 tienda de ejemplo
- ✅ 1 proveedor de ejemplo
- ✅ 5 productos de ejemplo

## 🚀 Uso

### Ejecutar el Seeder

```bash
# Asegúrate de tener MongoDB corriendo y .env configurado
node src/seeds/seedDatabase.js
```

**Credenciales creadas:**
```
Admin:    admin@globalstore.com / password123
Store:    store@globalstore.com / password123
Supplier: supplier@globalstore.com / password123
Customer: customer@globalstore.com / password123
```

### Usar Hooks en Modelos

Los hooks ya están disponibles pero **no están aplicados automáticamente**. Si quieres usarlos, debes importarlos en tus modelos:

```javascript
// En src/models/User.js (ejemplo)
const { hashPasswordBeforeSave } = require('../hooks/modelHooks');

// Antes de exportar el modelo
userSchema.pre('save', hashPasswordBeforeSave);
```

## 💡 Cuándo Usar

**Seeds:**
- ✅ Desarrollo local (datos de prueba)
- ✅ Testing (datos consistentes)
- ✅ Demos y presentaciones
- ❌ NO en producción

**Hooks:**
- ✅ Lógica que debe ejecutarse siempre
- ✅ Validaciones automáticas
- ✅ Transformaciones de datos
- ✅ Logging y auditoría

## 📝 Notas

- Los seeds pueden ejecutarse múltiples veces (crea datos nuevos cada vez)
- Si quieres limpiar la BD antes, descomenta las líneas `deleteMany` en el seeder
- Los hooks son opcionales - úsalos solo si los necesitas
