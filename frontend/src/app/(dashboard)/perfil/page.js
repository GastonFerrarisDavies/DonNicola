'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, Shield, ArrowLeft, Edit, Save, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser, updateProfile, isAuthenticated } from '@/lib/api/apiAuth';
import { useAuth } from '@/hooks/useAuth';

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Cargar datos del usuario
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const userData = getCurrentUser();
      if (userData) {
        setUser(userData);
        setFormData({
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          email: userData.email || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await updateProfile(formData);
      // Actualizar los datos del usuario local
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrors({ general: 'Error al actualizar el perfil. Inténtalo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al inicio
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Mi Perfil</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">
                    {user?.nombre} {user?.apellido}
                  </h2>
                  <p className="text-white/80 text-lg">{user?.email}</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Personal */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información Personal
                </h3>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.nombre ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Ingresa tu nombre"
                        />
                        {errors.nombre && (
                          <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        {user?.nombre || 'No especificado'}
                      </div>
                    )}
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.apellido ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Ingresa tu apellido"
                        />
                        {errors.apellido && (
                          <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        {user?.apellido || 'No especificado'}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Ingresa tu email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        {user?.email || 'No especificado'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Información del Sistema */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información del Sistema
                </h3>

                <div className="space-y-4">
                  {/* Rol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <div className="flex items-center text-gray-900">
                      <Shield className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user?.rol || 'usuario'}
                      </span>
                    </div>
                  </div>

                  {/* Fecha de registro */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Miembro desde
                    </label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
                    </div>
                  </div>

                  {/* ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Usuario
                    </label>
                    <div className="flex items-center text-gray-900">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {user?.id || 'No disponible'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            {isEditing && (
              <div className="mt-8 flex justify-end space-x-4 border-t border-gray-200 pt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 flex items-center disabled:opacity-50"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Acciones adicionales */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-quaternary text-white rounded-lg hover:bg-quaternary/80 transition-colors duration-200"
            >
              Ir al Dashboard
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cambiar contraseña
            </Link>
            <button
              onClick={logout}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
