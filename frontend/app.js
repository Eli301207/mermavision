// --- 1. PRODUCTOS ---
function cargarProductos() {
    fetch('http://localhost:3000/productos')
        .then(res => res.json())
        .then(productos => {
            const tbody = document.getElementById('tabla-productos');
            tbody.innerHTML = '';
            if (productos.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No hay productos.</td></tr>'; return; }
            productos.forEach(p => {
                tbody.innerHTML += `<tr><td>${p.id_producto}</td><td>${p.codigo}</td><td>${p.nombre}</td><td>$${p.precio_venta}</td><td>${p.stock_total}</td><td>${p.stock_minimo}</td><td><button class="btn-eliminar" onclick="eliminarProducto(${p.id_producto})">Eliminar</button></td></tr>`;
            });
        }).catch(err => console.error(err));
}

document.getElementById('form-producto').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        codigo: document.getElementById('codigo').value,
        nombre: document.getElementById('nombre').value,
        precio_venta: document.getElementById('precio').value,
        stock_total: document.getElementById('stock').value,
        stock_minimo: document.getElementById('minimo').value,
        id_categoria: document.getElementById('categoria').value
    };
    fetch('http://localhost:3000/productos', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Producto guardado'); document.getElementById('form-producto').reset(); cargarProductos(); });
});

function eliminarProducto(id) {
    if (confirm('¿Eliminar producto?')) {
        fetch(`http://localhost:3000/productos/${id}`, { method: 'DELETE' }).then(() => cargarProductos());
    }
}

// --- 2. CATEGORÍAS ---
function cargarCategorias() {
    fetch('http://localhost:3000/categorias')
        .then(res => res.json())
        .then(cats => {
            const tbody = document.getElementById('tabla-categorias');
            tbody.innerHTML = '';
            if (cats.length === 0) { tbody.innerHTML = '<tr><td colspan="4">No hay categorías.</td></tr>'; return; }
            cats.forEach(c => {
                tbody.innerHTML += `<tr><td>${c.id_categoria}</td><td>${c.nombre}</td><td>${c.descripcion}</td><td><button class="btn-eliminar" onclick="eliminarCategoria(${c.id_categoria})">Eliminar</button></td></tr>`;
            });
        });
}

document.getElementById('form-categoria').addEventListener('submit', e => {
    e.preventDefault();
    const data = { nombre: document.getElementById('cat-nombre').value, descripcion: document.getElementById('cat-descripcion').value };
    fetch('http://localhost:3000/categorias', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Categoría guardada'); document.getElementById('form-categoria').reset(); cargarCategorias(); });
});

function eliminarCategoria(id) {
    if (confirm('¿Eliminar categoría?')) {
        fetch(`http://localhost:3000/categorias/${id}`, { method: 'DELETE' }).then(() => cargarCategorias());
    }
}

// --- 3. PROVEEDORES ---
function cargarProveedores() {
    fetch('http://localhost:3000/proveedores')
        .then(res => res.json())
        .then(provs => {
            const tbody = document.getElementById('tabla-proveedores');
            tbody.innerHTML = '';
            if (provs.length === 0) { tbody.innerHTML = '<tr><td colspan="5">No hay proveedores.</td></tr>'; return; }
            provs.forEach(p => {
                tbody.innerHTML += `<tr><td>${p.id_proveedor}</td><td>${p.nombre}</td><td>${p.numero}</td><td>${p.correo}</td><td>${p.direccion}</td></tr>`;
            });
        });
}

document.getElementById('form-proveedor').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        nombre: document.getElementById('prov-nombre').value,
        numero: document.getElementById('prov-numero').value,
        correo: document.getElementById('prov-correo').value,
        direccion: document.getElementById('prov-direccion').value
    };
    fetch('http://localhost:3000/proveedores', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Proveedor guardado'); document.getElementById('form-proveedor').reset(); cargarProveedores(); });
});

// --- 4. PEDIDOS ---
function cargarPedidos() {
    fetch('http://localhost:3000/pedidos')
        .then(res => res.json())
        .then(peds => {
            const tbody = document.getElementById('tabla-pedidos');
            tbody.innerHTML = '';
            if (peds.length === 0) { tbody.innerHTML = '<tr><td colspan="4">No hay pedidos.</td></tr>'; return; }
            peds.forEach(p => {
                tbody.innerHTML += `<tr><td>${p.id_pedido}</td><td>${p.proveedor}</td><td>${p.fecha_pedido.replace('T',' ').substring(0,16)}</td><td>${p.fecha_llegada ? p.fecha_llegada.replace('T',' ').substring(0,16) : 'Pendiente'}</td></tr>`;
            });
        });
}

document.getElementById('form-pedido').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        id_proveedor: document.getElementById('ped-proveedor').value,
        fecha_llegada: document.getElementById('ped-llegada').value || null
    };
    fetch('http://localhost:3000/pedidos', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Pedido registrado'); document.getElementById('form-pedido').reset(); cargarPedidos(); });
});

// --- 5. LOTES ---
function cargarLotes() {
    fetch('http://localhost:3000/lotes')
        .then(res => res.json())
        .then(lotes => {
            const tbody = document.getElementById('tabla-lotes');
            tbody.innerHTML = '';
            if (lotes.length === 0) { tbody.innerHTML = '<tr><td colspan="5">No hay lotes.</td></tr>'; return; }
            lotes.forEach(l => {
                tbody.innerHTML += `<tr><td>${l.id_lote}</td><td>${l.id_producto}</td><td>$${l.costo_compra}</td><td>${l.cantidad_disponible}</td><td>${l.fecha_caducidad.substring(0,10)}</td></tr>`;
            });
        });
}

document.getElementById('form-lote').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        id_producto: document.getElementById('lote-producto').value,
        id_pedido: document.getElementById('lote-pedido').value || null,
        costo_compra: document.getElementById('lote-costo').value,
        cantidad_inicial: document.getElementById('lote-cant-ini').value,
        cantidad_disponible: document.getElementById('lote-cant-disp').value,
        fecha_caducidad: document.getElementById('lote-caducidad').value
    };
    fetch('http://localhost:3000/lotes', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Lote guardado'); document.getElementById('form-lote').reset(); cargarLotes(); });
});

// --- 6. USUARIOS ---
function cargarUsuarios() {
    fetch('http://localhost:3000/usuarios')
        .then(res => res.json())
        .then(usuarios => {
            const tbody = document.getElementById('tabla-usuarios');
            tbody.innerHTML = '';
            if (usuarios.length === 0) { tbody.innerHTML = '<tr><td colspan="4">No hay usuarios.</td></tr>'; return; }
            usuarios.forEach(u => {
                tbody.innerHTML += `<tr><td>${u.id_usuario}</td><td>${u.nombre}</td><td>${u.telefono}</td><td>${u.rfc}</td></tr>`;
            });
        });
}

document.getElementById('form-usuario').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        nombre: document.getElementById('usu-nombre').value,
        nip: document.getElementById('usu-nip').value,
        telefono: document.getElementById('usu-telefono').value,
        rfc: document.getElementById('usu-rfc').value
    };
    fetch('http://localhost:3000/usuarios', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Usuario guardado'); document.getElementById('form-usuario').reset(); cargarUsuarios(); });
});

// --- 7. CAJA SESIONES ---
function cargarCajaSesiones() {
    fetch('http://localhost:3000/caja_sesiones')
        .then(res => res.json())
        .then(sesiones => {
            const tbody = document.getElementById('tabla-caja');
            tbody.innerHTML = '';
            if (sesiones.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No hay sesiones.</td></tr>'; return; }
            sesiones.forEach(s => {
                tbody.innerHTML += `<tr><td>${s.id_sesion}</td><td>${s.usuario}</td><td>$${s.monto_inicial}</td><td>${s.monto_final ? '$'+s.monto_final : 'Abierta'}</td><td>${s.fecha_apertura.replace('T',' ').substring(0,16)}</td><td>${s.fecha_cierre ? s.fecha_cierre.replace('T',' ').substring(0,16) : '-'}</td></tr>`;
            });
        });
}

document.getElementById('form-caja').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        id_usuario: document.getElementById('caja-usuario').value,
        monto_inicial: document.getElementById('caja-monto').value
    };
    fetch('http://localhost:3000/caja_sesiones', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Caja abierta'); document.getElementById('form-caja').reset(); cargarCajaSesiones(); });
});

// --- 8. VENTAS ---
function cargarVentas() {
    fetch('http://localhost:3000/ventas')
        .then(res => res.json())
        .then(ventas => {
            const tbody = document.getElementById('tabla-ventas');
            tbody.innerHTML = '';
            if (ventas.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No hay ventas.</td></tr>'; return; }
            ventas.forEach(v => {
                tbody.innerHTML += `<tr><td>${v.id_venta}</td><td>${v.usuario}</td><td>${v.fecha_venta.replace('T',' ').substring(0,16)}</td><td>$${v.total}</td><td>$${v.monto_pago}</td><td>$${v.cambio}</td></tr>`;
            });
        });
}

document.getElementById('form-venta').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        id_usuario: document.getElementById('venta-usuario').value,
        id_sesion: document.getElementById('venta-sesion').value,
        total: document.getElementById('venta-total').value,
        monto_pago: document.getElementById('venta-pago').value,
        cambio: document.getElementById('venta-cambio').value
    };
    fetch('http://localhost:3000/ventas', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Venta registrada'); document.getElementById('form-venta').reset(); cargarVentas(); });
});

// --- 9. DETALLE DE VENTAS ---
function cargarDetalleVentas() {
    fetch('http://localhost:3000/detalle_ventas')
        .then(res => res.json())
        .then(detalles => {
            const tbody = document.getElementById('tabla-detalle-ventas');
            tbody.innerHTML = '';
            if (detalles.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No hay detalles registrados.</td></tr>'; return; }
            detalles.forEach(d => {
                tbody.innerHTML += `<tr><td>${d.id_detalle_venta}</td><td>${d.id_venta}</td><td>${d.producto}</td><td>${d.id_lote || '-'}</td><td>${d.cantidad}</td><td>$${d.precio_unitario}</td><td>$${d.subtotal}</td></tr>`;
            });
        });
}

document.getElementById('form-detalle-venta').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        id_venta: document.getElementById('dv-venta').value,
        id_producto: document.getElementById('dv-producto').value,
        id_lote: document.getElementById('dv-lote').value || null,
        cantidad: document.getElementById('dv-cantidad').value,
        precio_unitario: document.getElementById('dv-precio').value
    };
    fetch('http://localhost:3000/detalle_ventas', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Detalle de venta registrado'); document.getElementById('form-detalle-venta').reset(); cargarDetalleVentas(); });
});

// --- 10. MERMAS ---
function cargarMermas() {
    fetch('http://localhost:3000/mermas')
        .then(res => res.json())
        .then(mermas => {
            const tbody = document.getElementById('tabla-mermas');
            tbody.innerHTML = '';
            if (mermas.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No hay mermas.</td></tr>'; return; }
            mermas.forEach(m => {
                tbody.innerHTML += `<tr><td>${m.id_merma}</td><td>${m.producto}</td><td>${m.cantidad}</td><td>$${m.costo_perdida}</td><td>${m.fecha_merma.replace('T',' ').substring(0,16)}</td><td>${m.observaciones}</td></tr>`;
            });
        });
}

document.getElementById('form-merma').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        id_producto: document.getElementById('merma-producto').value,
        id_lote: document.getElementById('merma-lote').value,
        id_usuario: document.getElementById('merma-usuario').value,
        autorizado_por: document.getElementById('merma-autoriza').value || null,
        cantidad: document.getElementById('merma-cantidad').value,
        costo_perdida: document.getElementById('merma-costo').value,
        observaciones: document.getElementById('merma-obs').value
    };
    fetch('http://localhost:3000/mermas', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Merma registrada'); document.getElementById('form-merma').reset(); cargarMermas(); });
});

// --- 11. TURNOS Y ASISTENCIAS ---
function cargarTurnosYAsistencias() {
    fetch('http://localhost:3000/turnos').then(res => res.json()).then(turnos => {
        const tbody = document.getElementById('tabla-turnos');
        tbody.innerHTML = '';
        if (turnos.length === 0) { tbody.innerHTML = '<tr><td colspan="3">No hay turnos.</td></tr>'; return; }
        turnos.forEach(t => { tbody.innerHTML += `<tr><td>${t.id_turno}</td><td>${t.hora_entrada_programada}</td><td>${t.hora_salida_programada}</td></tr>`; });
    });

    fetch('http://localhost:3000/asistencias').then(res => res.json()).then(asis => {
        const tbody = document.getElementById('tabla-asistencias');
        tbody.innerHTML = '';
        if (asis.length === 0) { tbody.innerHTML = '<tr><td colspan="5">No hay asistencias.</td></tr>'; return; }
        asis.forEach(a => { tbody.innerHTML += `<tr><td>${a.id_asistencia}</td><td>${a.usuario}</td><td>${a.id_turno}</td><td>${a.fecha.substring(0,10)}</td><td>${a.hora_entrada.replace('T',' ').substring(0,16)}</td></tr>`; });
    });
}

document.getElementById('form-turno').addEventListener('submit', e => {
    e.preventDefault();
    const data = { hora_entrada_programada: document.getElementById('turno-entrada').value, hora_salida_programada: document.getElementById('turno-salida').value };
    fetch('http://localhost:3000/turnos', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Turno guardado'); document.getElementById('form-turno').reset(); cargarTurnosYAsistencias(); });
});

document.getElementById('form-asistencia').addEventListener('submit', e => {
    e.preventDefault();
    const data = { id_usuario: document.getElementById('asis-usuario').value, id_turno: document.getElementById('asis-turno').value, fecha: document.getElementById('asis-fecha').value };
    fetch('http://localhost:3000/asistencias', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Asistencia registrada'); document.getElementById('form-asistencia').reset(); cargarTurnosYAsistencias(); });
});

// --- 12. HISTORIAL DE PRECIOS ---
function cargarHistorial() {
    fetch('http://localhost:3000/historial_precios')
        .then(res => res.json())
        .then(historial => {
            const tbody = document.getElementById('tabla-historial');
            tbody.innerHTML = '';
            if (historial.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No hay historial.</td></tr>'; return; }
            historial.forEach(h => {
                tbody.innerHTML += `<tr><td>${h.id_historial}</td><td>${h.producto}</td><td>$${h.precio_anterior}</td><td>$${h.precio_nuevo}</td><td>${h.fecha_cambio.replace('T',' ').substring(0,16)}</td><td>${h.modificado_por}</td></tr>`;
            });
        });
}

document.getElementById('form-historial').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        id_producto: document.getElementById('hist-producto').value,
        precio_anterior: document.getElementById('hist-anterior').value,
        precio_nuevo: document.getElementById('hist-nuevo').value,
        modificado_por: document.getElementById('hist-usuario').value
    };
    fetch('http://localhost:3000/historial_precios', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(() => { alert('Historial registrado'); document.getElementById('form-historial').reset(); cargarHistorial(); });
});

// --- CARGA INICIAL ---
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCategorias();
    cargarProveedores();
    cargarPedidos();
    cargarLotes();
    cargarUsuarios();
    cargarCajaSesiones();
    cargarVentas();
    cargarDetalleVentas();
    cargarMermas();
    cargarTurnosYAsistencias();
    cargarHistorial();
});