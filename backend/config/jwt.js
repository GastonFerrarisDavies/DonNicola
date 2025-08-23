// Configuración centralizada para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_para_desarrollo';

module.exports = {
    JWT_SECRET
};
