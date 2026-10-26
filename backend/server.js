const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión para TiDB Cloud
const db = mysql.createConnection({
  host: 'gateway01.us-west-2.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3sqteT4ameX4x2V.root',
  password: '5zk6JtfeTHBH6V0u', // Cambia esto por tu contraseña real
  database: 'mermavision',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a TiDB Cloud:', err);
    return;
  }
  console.log('¡Conectado exitosamente a la base de datos en TiDB Cloud (mermavision)!');
});

// --- PRODUCTOS ---
app.get('/productos', (req, res) => {
  const query = 'SELECT id_producto, codigo, nombre, precio_venta, stock_total, stock_minimo FROM productos';
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al consultar productos:', err);
      res.status(500).json({ error: 'Error al obtener los datos' });
      return;
    }
    res.json(resultados);
  });
});

app.post('/productos', (req, res) => {
  const { codigo, nombre, precio_venta, stock_total, stock_minimo, id_categoria } = req.body;
  const query = 'INSERT INTO productos (codigo, nombre, precio_venta, stock_total, stock_minimo, id_categoria) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [codigo, nombre, precio_venta, stock_total, stock_minimo, id_categoria], (err, resultado) => {
    if (err) {
      console.error('Error al guardar el producto:', err);
      res.status(500).json({ error: 'Hubo un error al guardar' });
      return;
    }
    res.json({ mensaje: 'Producto guardado con éxito' });
  });
});

app.delete('/productos/:id', (req, res) => {
  const idProducto = req.params.id;
  const query = 'DELETE FROM productos WHERE id_producto = ?';
  db.query(query, [idProducto], (err, resultado) => {
    if (err) {
      console.error('Error al eliminar:', err);
      res.status(500).json({ error: 'Error al eliminar el producto' });
      return;
    }
    res.json({ mensaje: 'Producto eliminado correctamente' });
  });
});

// --- MERMAS ---
app.get('/mermas', (req, res) => {
  const query = `
    SELECT m.id_merma, p.nombre AS producto, m.cantidad, m.costo_perdida, m.fecha_merma, m.observaciones 
    FROM mermas m
    JOIN productos p ON m.id_producto = p.id_producto
  `;
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al consultar mermas:', err);
      res.status(500).json({ error: 'Error al obtener mermas' });
      return;
    }
    res.json(resultados);
  });
});

app.post('/mermas', (req, res) => {
  const { id_producto, id_lote, id_usuario, autorizado_por, cantidad, costo_perdida, observaciones } = req.body;
  const query = `
    INSERT INTO mermas (id_producto, id_lote, id_usuario, autorizado_por, cantidad, costo_perdida, observaciones) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [id_producto, id_lote, id_usuario, autorizado_por, cantidad, costo_perdida, observaciones], (err, resultado) => {
    if (err) {
      console.error('Error al guardar la merma:', err);
      res.status(500).json({ error: 'Error al registrar la merma' });
      return;
    }
    res.json({ mensaje: 'Merma registrada con éxito' });
  });
});

// --- USUARIOS ---
app.get('/usuarios', (req, res) => {
  const query = 'SELECT id_usuario, nombre, telefono, rfc FROM usuarios';
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al consultar usuarios:', err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
      return;
    }
    res.json(resultados);
  });
});

app.post('/usuarios', (req, res) => {
  const { nombre, nip, telefono, rfc } = req.body;
  const query = 'INSERT INTO usuarios (nombre, nip, telefono, rfc) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, nip, telefono, rfc], (err, resultado) => {
    if (err) {
      console.error('Error al guardar usuario:', err);
      res.status(500).json({ error: 'Error al registrar usuario' });
      return;
    }
    res.json({ mensaje: 'Usuario registrado con éxito' });
  });
});

// --- PROVEEDORES ---
app.get('/proveedores', (req, res) => {
  const query = 'SELECT * FROM proveedores';
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al consultar proveedores:', err);
      res.status(500).json({ error: 'Error al obtener proveedores' });
      return;
    }
    res.json(resultados);
  });
});

app.post('/proveedores', (req, res) => {
  const { nombre, numero, correo, direccion } = req.body;
  const query = 'INSERT INTO proveedores (nombre, numero, correo, direccion) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, numero, correo, direccion], (err, resultado) => {
    if (err) {
      console.error('Error al guardar proveedor:', err);
      res.status(500).json({ error: 'Error al registrar proveedor' });
      return;
    }
    res.json({ mensaje: 'Proveedor registrado con éxito' });
  });
});

// --- LOTES ---
app.get('/lotes', (req, res) => {
  const query = 'SELECT * FROM lotes';
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al consultar lotes:', err);
      res.status(500).json({ error: 'Error al obtener lotes' });
      return;
    }
    res.json(resultados);
  });
});

app.post('/lotes', (req, res) => {
  const { id_producto, id_pedido, costo_compra, cantidad_inicial, cantidad_disponible, fecha_caducidad } = req.body;
  const query = `
    INSERT INTO lotes (id_producto, id_pedido, costo_compra, cantidad_inicial, cantidad_disponible, fecha_caducidad) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [id_producto, id_pedido || null, costo_compra, cantidad_inicial, cantidad_disponible, fecha_caducidad], (err, resultado) => {
    if (err) {
      console.error('Error al guardar lote:', err);
      res.status(500).json({ error: 'Error al registrar lote' });
      return;
    }
    res.json({ mensaje: 'Lote registrado con éxito' });
  });
});

// --- CATEGORÍAS ---
app.get('/categorias', (req, res) => {
  const query = 'SELECT * FROM categorias';
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al consultar categorías:', err);
      res.status(500).json({ error: 'Error al obtener categorías' });
      return;
    }
    res.json(resultados);
  });
});

app.post('/categorias', (req, res) => {
  const { nombre, descripcion } = req.body;
  const query = 'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)';
  db.query(query, [nombre, descripcion], (err, resultado) => {
    if (err) {
      console.error('Error al guardar categoría:', err);
      res.status(500).json({ error: 'Error al registrar categoría' });
      return;
    }
    res.json({ mensaje: 'Categoría registrada con éxito' });
  });
});

app.delete('/categorias/:id', (req, res) => {
  const idCategoria = req.params.id;
  const query = 'DELETE FROM categorias WHERE id_categoria = ?';
  db.query(query, [idCategoria], (err, resultado) => {
    if (err) {
      console.error('Error al eliminar categoría:', err);
      res.status(500).json({ error: 'Error al eliminar la categoría' });
      return;
    }
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  });
});

// --- INICIO DEL SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});