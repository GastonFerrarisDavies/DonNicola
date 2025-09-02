'use client'  
import Link from "next/link"
import { useState, useEffect } from "react"
import Boton from "../components/boton"
import Tarjeta from "../components/tarjeta"
import Footer from "../components/footer"
import { isAuthenticated, getCurrentUser } from "@/lib/api/apiAuth"

export default function HomePage() {
  const [userAuth, setUserAuth] = useState({
    isLoggedIn: false,
    user: null
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar el estado de autenticación al cargar la página
    const checkAuth = () => {
      try {
        const authStatus = isAuthenticated();
        console.log('Auth status check:', authStatus); // Debug log
        
        if (authStatus) {
          const userData = getCurrentUser();
          console.log('User data:', userData); // Debug log
          setUserAuth({
            isLoggedIn: true,
            user: userData
          });
        } else {
          console.log('User not authenticated'); // Debug log
          setUserAuth({
            isLoggedIn: false,
            user: null
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUserAuth({
          isLoggedIn: false,
          user: null
        });
      }
    };

    // Verificar autenticación inicial
    checkAuth();

    // Escuchar cambios en localStorage (para cuando el usuario hace login/logout en otra pestaña)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuth();
      }
    };

    // Escuchar eventos personalizados de autenticación (para cambios en la misma pestaña)
    const handleAuthChange = (e) => {
      const { isAuthenticated: authStatus, user } = e.detail;
      setUserAuth({
        isLoggedIn: authStatus,
        user: user
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Cerrar menú móvil cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar menú móvil cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileButton = document.getElementById('mobile-button');
      
      if (mobileMenu && mobileButton && !mobileMenu.contains(event.target) && !mobileButton.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-tertiary">
      {/* Header */}
      <header className={`bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50 relative transition-all duration-300 ${isMobileMenuOpen ? 'backdrop-blur-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-primary cursor-pointer hover:text-quinary transition-colors duration-300">
                  Don Nicola
                </h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => scrollToSection('inicio')}
                  className="text-quaternary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-tertiary"
                >
                  Inicio
                </button>
                <button
                  onClick={() => scrollToSection('servicios')}
                  className="text-quaternary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-tertiary"
                >
                  Servicios
                </button>
                <button
                  onClick={() => scrollToSection('nosotros')}
                  className="text-quaternary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-tertiary"
                >
                  Nosotros
                </button>
                <button
                  onClick={() => scrollToSection('contacto')}
                  className="text-quaternary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-tertiary"
                >
                  Contacto
                </button>
                {userAuth.isLoggedIn ? (
                  <Link
                    href="/perfil"
                    className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {userAuth.user?.nombre || 'Mi Perfil'}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                id="mobile-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-quaternary hover:text-primary hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-300"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú principal</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div id="mobile-menu" className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 z-50`}>
            {/* Overlay oscuro solo para el header */}
            <div 
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            {/* Menú desplegable */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-b-lg mx-4 mt-2 shadow-2xl border border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button
                  onClick={() => {
                    scrollToSection('inicio');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-quaternary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-tertiary w-full text-left"
                >
                  Inicio
                </button>
                <button
                  onClick={() => {
                    scrollToSection('servicios');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-quaternary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-tertiary w-full text-left"
                >
                  Servicios
                </button>
                <button
                  onClick={() => {
                    scrollToSection('nosotros');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-quaternary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-tertiary w-full text-left"
                >
                  Nosotros
                </button>
                <button
                  onClick={() => {
                    scrollToSection('contacto');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-quaternary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-tertiary w-full text-left"
                >
                  Contacto
                </button>
                <div className="pt-4 border-t border-gray-200">
                  {userAuth.isLoggedIn ? (
                    <Link
                      href="/perfil"
                      className="bg-primary hover:bg-secondary text-white block w-full text-center px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {userAuth.user?.nombre || 'Mi Perfil'}
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-primary hover:bg-secondary text-white block w-full text-center px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-primary via-secondary to-quinary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Don Nicola: 
              <span className="block text-4xl md:text-6xl font-light mt-2">Sabor con historia</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Desde nuestras raíces, elaboramos quesos con pasión y el toque artesanal que nos distingue. 
              Cada bocado cuenta una historia de tradición y dedicación.
            </p>
                         <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link href="/verproductos">
                 <Boton variant="quaternary" size="large" className="shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                   Explora nuestros productos
                 </Boton>
               </Link>
              <Boton variant="outlineQuaternary" size="large" className="border-white text-white hover:bg-white hover:text-primary shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                Encuentra tu sucursal
              </Boton>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="py-24 bg-gradient-to-b from-white to-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-quaternary mb-6">¿Por qué elegirnos?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre las características que nos hacen únicos en el mercado y nos han convertido en referentes de calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Tarjeta variant="primary" size="large" hover={true} className="transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quaternary mb-4">Tradición Familiar</h3>
              <p className="text-gray-600 leading-relaxed">
                Más de 10 años de experiencia en la elaboración artesanal de quesos con recetas familiares 
                que han pasado de generación en generación.
              </p>
            </Tarjeta>

            <Tarjeta variant="secondary" size="large" hover={true} className="transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quaternary mb-4">Calidad Premium</h3>
              <p className="text-gray-600 leading-relaxed">
                Utilizamos solo los mejores ingredientes y procesos controlados para garantizar 
                la excelencia en cada producto que elaboramos.
              </p>
            </Tarjeta>

            <Tarjeta variant="quaternary" size="large" hover={true} className="transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-quaternary/10 rounded-2xl flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-quaternary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quaternary mb-4">Sabor Único</h3>
              <p className="text-gray-600 leading-relaxed">
                Cada queso tiene un sabor único que refleja nuestra pasión por la artesanía culinaria 
                y el cuidado en cada etapa del proceso.
              </p>
            </Tarjeta>
          </div>
        </div>
      </section>

      {/* Sección de Servicios */}
      <section id="servicios" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-quaternary mb-6">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ofrecemos una amplia gama de servicios para satisfacer todas tus necesidades en quesos artesanales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-tertiary to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quaternary mb-4">Venta al Detalle</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Compra nuestros quesos artesanales directamente en nuestras sucursales. 
                Ofrecemos una amplia variedad de quesos frescos y embutidos.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Quesos frescos del día</li>
                <li>• Amplia variedad en stock</li>
                <li>• Flexibilidad horaria</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-tertiary to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quaternary mb-4">Adaptabilidad</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Servicios personalizados para cada tipo de cliente, desde familias consumidoras finales, hasta negocios y emprenedores que lo utilizan como materia prima.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Atención personalizada</li>
                <li>• Beneficios exclusivos</li>
              </ul>
            </div>

            
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Números</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Cifras que respaldan nuestra trayectoria y compromiso con la excelencia
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center group">
              <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">10+</div>
              <div className="text-white/90 text-lg font-medium">Años de tradición</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-white/90 text-lg font-medium">Artesanal</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">5+</div>
              <div className="text-white/90 text-lg font-medium">Variedades de queso</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">2</div>
              <div className="text-white/90 text-lg font-medium">Sucursales</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Nosotros */}
      <section id="nosotros" className="py-24 bg-gradient-to-b from-tertiary to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-quaternary mb-6">Sobre Nosotros</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Conoce la historia detrás de Don Nicola y nuestra pasión por los quesos artesanales
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold text-quaternary mb-6">Nuestra Historia</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Don Nicola nació de la pasión de una familia por los quesos artesanales. 
                  Todo comenzó en una pequeña cocina familiar donde las recetas se transmitían 
                  de generación en generación, manteniendo viva la tradición italiana.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Hoy, después de más de una década, seguimos elaborando cada queso con la misma 
                  dedicación y amor que nuestros antepasados, combinando técnicas tradicionales 
                  con la innovación moderna.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border border-primary/20">
                <h3 className="text-2xl font-bold text-quaternary mb-4">Nuestra Misión</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Llevar a tu mesa los mejores quesos artesanales, elaborados con ingredientes 
                  de la más alta calidad y técnicas que preservan el auténtico sabor italiano.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">Calidad garantizada</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold text-quaternary mb-6">Nuestros Valores</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-quaternary mb-2">Pasión</h4>
                      <p className="text-gray-600">Amamos lo que hacemos y eso se refleja en cada producto.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-quaternary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-quaternary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-quaternary mb-2">Tradición</h4>
                      <p className="text-gray-600">Respetamos y preservamos las técnicas ancestrales.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-quinary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-quinary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-quaternary mb-2">Comunidad</h4>
                      <p className="text-gray-600">Construimos relaciones duraderas con nuestros clientes.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-quaternary mb-2">Innovación</h4>
                      <p className="text-gray-600">Buscamos constantemente mejorar nuestros procesos.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-quaternary to-quinary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo para descubrir?</h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Sé parte de nuestra comunidad que ya confía en Don Nicola para disfrutar 
            de los mejores quesos artesanales con sabor auténtico.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Boton variant="outlineSecondary" size="large" className="border-white text-white hover:bg-white hover:text-primary shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              Contáctanos por WhatsApp
            </Boton>
            <Link href="/productos">
              <Boton variant="quaternary" size="large" className="shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                Visita nuestras sucursales
              </Boton>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
