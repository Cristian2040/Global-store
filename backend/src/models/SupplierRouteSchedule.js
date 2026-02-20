const mongoose = require("mongoose");

const dayPlanSchema = new mongoose.Schema(
    {
        dayOfWeek: {
            type: Number,
            required: true,
            min: 1,
            max: 7,
            index: true
        }, // 1=Lun..7=Dom
        windowStart: {
            type: String,
            trim: true
        }, // "09:00"
        windowEnd: {
            type: String,
            trim: true
        },   // "18:00"
        capacityStops: {
            type: Number,
            min: 0
        },    // opcional: límite de entregas ese día
        notes: {
            type: String,
            trim: true
        },
    },
    { _id: false }
);

const supplierRouteScheduleSchema = new mongoose.Schema(
    {
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
            index: true,
        },

        routeName: {
            type: String,
            required: true,
            trim: true
        }, // "Ruta Centro"
        description: {
            type: String,
            trim: true
        },

        // Cobertura: puedes usar una o ambas (zonas y/o tiendas)
        coverage: {
            zones: [{
                type: String,
                trim: true,
                index: true
            }], // "Centro", "Villas", "Juárez"
            storeIds: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Store",
                index: true
            }], // tiendas específicas
            notes: {
                type: String,
                trim: true
            },
        },

        days: {
            type: [dayPlanSchema],
            validate: [(arr) => Array.isArray(arr) && arr.length > 0, "Configura al menos un día"],
        },

        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Un proveedor no debe repetir el nombre de ruta
supplierRouteScheduleSchema.index({ supplierId: 1, routeName: 1 }, { unique: true });

// Para buscar rutas por tienda rápido (si usas coverage.storeIds)
supplierRouteScheduleSchema.index({ supplierId: 1, "coverage.storeIds": 1 });

// Para buscar rutas por zona rápido (si usas coverage.zones)
supplierRouteScheduleSchema.index({ supplierId: 1, "coverage.zones": 1 });

module.exports = mongoose.model("SupplierRouteSchedule", supplierRouteScheduleSchema);
