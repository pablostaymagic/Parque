const pool = require('../db');
const fs = require('fs');
const path = require('path');

// Inicializar tablas de archivos si no existen
const initFilesTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.estacion_archivos (
                id SERIAL PRIMARY KEY,
                estacion_id INT NOT NULL,
                tipo VARCHAR(50) NOT NULL,
                archivo_nombre VARCHAR(255) NOT NULL,
                archivo_url TEXT NOT NULL,
                archivo_tamaño INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (estacion_id) REFERENCES public.estaciones(id) ON DELETE CASCADE
            );
        `);
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_estacion_archivos_estacion ON public.estacion_archivos(estacion_id);
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.subestacion_archivos (
                id SERIAL PRIMARY KEY,
                subestacion_id INT NOT NULL,
                tipo VARCHAR(50) NOT NULL,
                archivo_nombre VARCHAR(255) NOT NULL,
                archivo_url TEXT NOT NULL,
                archivo_tamaño INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (subestacion_id) REFERENCES public.subestaciones(id) ON DELETE CASCADE
            );
        `);
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_subestacion_archivos_subestacion ON public.subestacion_archivos(subestacion_id);
        `);
        console.log("✅ Tablas 'estacion_archivos' y 'subestacion_archivos' inicializadas correctamente en PostgreSQL");
    } catch (err) {
        console.error("❌ Error inicializando tablas de archivos:", err);
    }
};

initFilesTables();

// Helper para eliminar archivos físicos de la carpeta uploads
const deletePhysicalFile = (filePath) => {
    if (!filePath) return;
    try {
        // filePath es del tipo '/uploads/estaciones/filename.ext'
        const absolutePath = path.join(__dirname, '../..', filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log(`[FS] Archivo eliminado físicamente: ${absolutePath}`);
        } else {
            console.log(`[FS] Archivo no encontrado para eliminar: ${absolutePath}`);
        }
    } catch (err) {
        console.error(`[FS] Error al eliminar el archivo ${filePath}:`, err);
    }
};

// Crear una nueva estación
exports.createEstacion = async (req, res) => {
    try {
        const { orden, visibilidad, nombre_estacion, descripcion_principal } = req.body;
        
        console.log("Recibido en backend:", req.body);

        const query = `
            INSERT INTO public.estaciones (orden, visibilidad, nombre_estacion, descripcion_principal)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [
            orden || 0,
            visibilidad || 'activo',
            nombre_estacion || '',
            descripcion_principal || ''
        ];

        console.log("Valores para insertar en DB (Estación):", values);
        const result = await pool.query(query, values);
        const estacionId = result.rows[0].id;

        // --- PROCESAR Y GUARDAR ARCHIVOS DE LA ESTACIÓN ---
        const stationPaths = [];
        if (req.files) {
            const stationFiles = req.files.filter(f => f.fieldname === 'media' || f.fieldname === 'archivos[]');
            for (const file of stationFiles) {
                const tipo = file.mimetype.startsWith('video/') ? 'video' : 'image';
                const ruta = `/uploads/estaciones/${file.filename}`;
                stationPaths.push(ruta);
                
                await pool.query(`
                    INSERT INTO public.estacion_archivos (estacion_id, tipo, archivo_nombre, archivo_url, archivo_tamaño, created_at)
                    VALUES ($1, $2, $3, $4, $5, NOW())
                `, [estacionId, tipo, file.originalname, ruta, file.size]);
            }
        }

        // Sincronizar columna media de la tabla estaciones
        await pool.query(`
            UPDATE public.estaciones
            SET media = $1
            WHERE id = $2
        `, [stationPaths, estacionId]);

        // --- PROCESAR SUBESTACIONES ---
        const subestaciones = req.body.subestaciones ? JSON.parse(req.body.subestaciones) : [];
        console.log('Subestaciones recibidas:', subestaciones);

        for (let i = 0; i < subestaciones.length; i++) {
            const sub = subestaciones[i];
            
            const subQuery = `
                INSERT INTO public.subestaciones (estacion_id, nombre, description, orden)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `;
            const subValues = [estacionId, sub.nombre || '', sub.description || '', sub.orden || (i + 1)];
            const subResult = await pool.query(subQuery, subValues);
            const subestacionId = subResult.rows[0].id;

            // Guardar archivos específicos de esta subestación
            const subPaths = [];
            if (req.files) {
                const subFiles = req.files.filter(f => f.fieldname === `sub_${i}_media` || f.fieldname === `sub_${i}_archivos[]`);
                for (const file of subFiles) {
                    const tipo = file.mimetype.startsWith('video/') ? 'video' : 'image';
                    const ruta = `/uploads/estaciones/${file.filename}`;
                    subPaths.push(ruta);
                    
                    await pool.query(`
                        INSERT INTO public.subestacion_archivos (subestacion_id, tipo, archivo_nombre, archivo_url, archivo_tamaño, created_at)
                        VALUES ($1, $2, $3, $4, $5, NOW())
                    `, [subestacionId, tipo, file.originalname, ruta, file.size]);
                }
            }

            // Sincronizar columna media de la tabla subestaciones
            await pool.query(`
                UPDATE public.subestaciones
                SET media = $1
                WHERE id = $2
            `, [subPaths, subestacionId]);
        }

        res.status(201).json({
            success: true,
            message: 'Estación, subestaciones y todos los archivos guardados correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('ERROR REAL POSTGRESQL:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtener todas las estaciones
exports.getAllEstaciones = async (req, res) => {
    try {
        // 1. Obtener todas las estaciones
        const estacionesResult = await pool.query(
            `SELECT * FROM public.estaciones ORDER BY orden ASC`
        );

        // 2. Obtener todas las subestaciones
        const subestacionesResult = await pool.query(
            `SELECT * FROM public.subestaciones ORDER BY orden ASC`
        );

        // 3. Obtener todos los archivos de estaciones
        const estacionesArchivosResult = await pool.query(
            `SELECT * FROM public.estacion_archivos`
        );

        // 4. Obtener todos los archivos de subestaciones
        const subestacionesArchivosResult = await pool.query(
            `SELECT * FROM public.subestacion_archivos`
        );

        const todasSubestaciones = subestacionesResult.rows;
        const todosEstacionesArchivos = estacionesArchivosResult.rows;
        const todosSubestacionesArchivos = subestacionesArchivosResult.rows;

        // 5. Ensamblar: asociar subestaciones y archivos a cada estación
        const resultadoFinal = estacionesResult.rows.map(estacion => {
            const subsDeLaEstacion = todasSubestaciones.filter(
                s => String(s.estacion_id) === String(estacion.id)
            );

            // Mapear archivos de la estación desde la tabla intermedia
            const archivosDeLaEstacion = todosEstacionesArchivos.filter(
                a => String(a.estacion_id) === String(estacion.id)
            ).map(a => a.archivo_url);

            return {
                ...estacion,
                media: archivosDeLaEstacion.length > 0 ? archivosDeLaEstacion : (estacion.media || []),
                subestaciones: subsDeLaEstacion.map(sub => {
                    const archivosDeLaSubestacion = todosSubestacionesArchivos.filter(
                        sa => String(sa.subestacion_id) === String(sub.id)
                    ).map(sa => sa.archivo_url);

                    return {
                        ...sub,
                        media: archivosDeLaSubestacion.length > 0 ? archivosDeLaSubestacion : (sub.media || [])
                    };
                })
            };
        });

        res.status(200).json({
            success: true,
            message: 'Estaciones obtenidas exitosamente',
            data: resultadoFinal
        });
    } catch (error) {
        console.error('Error obteniendo estaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estaciones',
            error: error.message
        });
    }
};

// Obtener una estación por ID
exports.getEstacionById = async (req, res) => {
    try {
        const { id } = req.params;

        const estacionQuery = 'SELECT * FROM public.estaciones WHERE id = $1';
        const estacionResult = await pool.query(estacionQuery, [id]);

        if (estacionResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Estación no encontrada'
            });
        }

        // Obtener archivos de la estación
        const archivosResult = await pool.query(
            'SELECT archivo_url FROM public.estacion_archivos WHERE estacion_id = $1',
            [id]
        );
        let media = archivosResult.rows.map(r => r.archivo_url);
        if (media.length === 0) {
            media = estacionResult.rows[0].media || [];
        }

        // Obtener subestaciones
        const subQuery = 'SELECT * FROM public.subestaciones WHERE estacion_id = $1 ORDER BY orden ASC';
        const subResult = await pool.query(subQuery, [id]);
        const subestaciones = subResult.rows;

        // Obtener archivos de subestaciones
        const subestacionesIds = subestaciones.map(s => s.id);
        let subestacionesArchivos = [];
        if (subestacionesIds.length > 0) {
            const subArchivosResult = await pool.query(
                'SELECT subestacion_id, archivo_url FROM public.subestacion_archivos WHERE subestacion_id = ANY($1)',
                [subestacionesIds]
            );
            subestacionesArchivos = subArchivosResult.rows;
        }

        const subestacionesConMedia = subestaciones.map(sub => {
            let archivosDeLaSubestacion = subestacionesArchivos.filter(
                sa => String(sa.subestacion_id) === String(sub.id)
            ).map(sa => sa.archivo_url);

            if (archivosDeLaSubestacion.length === 0) {
                archivosDeLaSubestacion = sub.media || [];
            }

            return {
                ...sub,
                media: archivosDeLaSubestacion
            };
        });

        const data = {
            ...estacionResult.rows[0],
            media,
            subestaciones: subestacionesConMedia
        };

        res.status(200).json({
            success: true,
            message: 'Estación obtenida exitosamente',
            data: data
        });
    } catch (error) {
        console.error('Error obteniendo estación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la estación',
            error: error.message
        });
    }
};

// Actualizar una estación
exports.updateEstacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { orden, visibilidad, nombre_estacion, descripcion_principal } = req.body;

        // 1. Eliminar físicamente y de la base de datos los archivos en archivosBorrados
        const archivosBorrados = req.body.archivosBorrados ? JSON.parse(req.body.archivosBorrados) : [];
        for (const filePath of archivosBorrados) {
            await pool.query('DELETE FROM public.estacion_archivos WHERE archivo_url = $1', [filePath]);
            await pool.query('DELETE FROM public.subestacion_archivos WHERE archivo_url = $1', [filePath]);
            deletePhysicalFile(filePath);
        }

        // 2. Actualizar la estación en la base de datos
        const query = `
            UPDATE public.estaciones
            SET orden = $1, visibilidad = $2, nombre_estacion = $3, descripcion_principal = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;
        const values = [
            orden || 0,
            (visibilidad || 'activo').toLowerCase(),
            nombre_estacion || '',
            descripcion_principal || '',
            id
        ];
        
        console.log("Valores para actualizar en DB:", values);
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Estación no encontrada'
            });
        }

        // 3. Conservar archivos existentes y agregar nuevos archivos
        const stationPaths = [];
        
        // A. Agregar los existentes que el frontend mandó como conservados
        const existingMedia = req.body.existingMedia ? JSON.parse(req.body.existingMedia) : [];
        stationPaths.push(...existingMedia);

        // B. Insertar los nuevos archivos de la estación principal
        if (req.files) {
            const stationFiles = req.files.filter(f => f.fieldname === 'media' || f.fieldname === 'archivos[]');
            for (const file of stationFiles) {
                const tipo = file.mimetype.startsWith('video/') ? 'video' : 'image';
                const ruta = `/uploads/estaciones/${file.filename}`;
                stationPaths.push(ruta);
                
                await pool.query(`
                    INSERT INTO public.estacion_archivos (estacion_id, tipo, archivo_nombre, archivo_url, archivo_tamaño, created_at)
                    VALUES ($1, $2, $3, $4, $5, NOW())
                `, [id, tipo, file.originalname, ruta, file.size]);
            }
        }

        // Sincronizar columna media de la tabla estaciones
        await pool.query(`
            UPDATE public.estaciones
            SET media = $1
            WHERE id = $2
        `, [stationPaths, id]);

        // 4. Procesar Subestaciones (Eliminar y re-insertar)
        const subestaciones = req.body.subestaciones ? JSON.parse(req.body.subestaciones) : [];
        
        // Al eliminar de la tabla subestaciones, el ON DELETE CASCADE elimina automáticamente los registros de subestacion_archivos
        await pool.query('DELETE FROM public.subestaciones WHERE estacion_id = $1', [id]);

        for (let i = 0; i < subestaciones.length; i++) {
            const sub = subestaciones[i];
            
            const subQuery = `
                INSERT INTO public.subestaciones (estacion_id, nombre, description, orden)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `;
            const subValues = [id, sub.nombre || '', sub.description || '', sub.orden || (i + 1)];
            const subResult = await pool.query(subQuery, subValues);
            const subestacionId = subResult.rows[0].id;

            // Guardar archivos específicos de esta subestación
            const subPaths = [];

            // A. Insertar de nuevo los archivos existentes que se conservaron en la subestación
            const subExistingMedia = sub.media && Array.isArray(sub.media) ? sub.media : [];
            for (const filePath of subExistingMedia) {
                const fileName = path.basename(filePath);
                const tipo = filePath.match(/\.(mp4|mov)$/i) ? 'video' : 'image';
                let size = null;
                try {
                    const absolutePath = path.join(__dirname, '../..', filePath);
                    if (fs.existsSync(absolutePath)) {
                        size = fs.statSync(absolutePath).size;
                    }
                } catch (err) {
                    console.error('[FS] Error reading size:', err);
                }

                await pool.query(`
                    INSERT INTO public.subestacion_archivos (subestacion_id, tipo, archivo_nombre, archivo_url, archivo_tamaño, created_at)
                    VALUES ($1, $2, $3, $4, $5, NOW())
                `, [subestacionId, tipo, fileName, filePath, size]);
                subPaths.push(filePath);
            }

            // B. Insertar los nuevos archivos cargados para la subestación
            if (req.files) {
                const subFiles = req.files.filter(f => f.fieldname === `sub_${i}_media` || f.fieldname === `sub_${i}_archivos[]`);
                for (const file of subFiles) {
                    const tipo = file.mimetype.startsWith('video/') ? 'video' : 'image';
                    const ruta = `/uploads/estaciones/${file.filename}`;
                    subPaths.push(ruta);
                    
                    await pool.query(`
                        INSERT INTO public.subestacion_archivos (subestacion_id, tipo, archivo_nombre, archivo_url, archivo_tamaño, created_at)
                        VALUES ($1, $2, $3, $4, $5, NOW())
                    `, [subestacionId, tipo, file.originalname, ruta, file.size]);
                }
            }

            // Sincronizar columna media de la tabla subestaciones
            await pool.query(`
                UPDATE public.subestaciones
                SET media = $1
                WHERE id = $2
            `, [subPaths, subestacionId]);
        }

        res.status(200).json({
            success: true,
            message: 'Datos guardados correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('ERROR REAL POSTGRESQL:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Eliminar una estación
exports.deleteEstacion = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Obtener archivos de la estación
        const archivosResult = await pool.query('SELECT archivo_url FROM public.estacion_archivos WHERE estacion_id = $1', [id]);
        const mainMedia = archivosResult.rows.map(r => r.archivo_url);

        // 2. Obtener archivos de subestaciones
        const subestacionesResult = await pool.query('SELECT id FROM public.subestaciones WHERE estacion_id = $1', [id]);
        const subIds = subestacionesResult.rows.map(r => r.id);

        let subMedia = [];
        if (subIds.length > 0) {
            const subArchivosResult = await pool.query('SELECT archivo_url FROM public.subestacion_archivos WHERE subestacion_id = ANY($1)', [subIds]);
            subMedia = subArchivosResult.rows.map(r => r.archivo_url);
        }

        // 3. Recopilar todos los archivos físicos y borrarlos de disco
        const filesToDelete = [...mainMedia, ...subMedia];
        filesToDelete.forEach(filePath => {
            deletePhysicalFile(filePath);
        });

        // 4. Eliminar registros de la base de datos (CASCADE se encargará de las tablas asociadas)
        await pool.query('DELETE FROM public.estaciones WHERE id = $1', [id]);

        res.status(200).json({
            success: true,
            message: 'Estación, subestaciones y todos los archivos eliminados exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando estación:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};