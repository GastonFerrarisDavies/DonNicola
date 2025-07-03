const express = require('express');
const cors = require('cors');
const db = require('./models');
const port = process.env.PORT || 8080;
const app = express();

//Importar Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const brandRoutes = require('./routes/brandRoutes');

//Configurar Middlewares
app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true}));
app.use(express.json());

//Ruta Home
app.get('/', (req, res) => {
    res.json({message: 'Bienvenido a Don Nicola'});
});

//Usar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/brands', brandRoutes);

//Conectar Base de Datos e Iniciar Servidor
db.sequelize.authenticate()
    .then(() => {
        console.log('Base de Datos Conectada');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log('Error al conectar a la base de datos', error);
        process.exit(1);
    });

//Cierre
process.on('SIGINT', () => {
    db.sequelize.close()
        .then(() => {
            console.log('Base de Datos Desconectada');
            process.exit(0);
        })
        .catch((error) => {
            console.log('Error al desconectar la base de datos', error);
            process.exit(0);
        });
});
