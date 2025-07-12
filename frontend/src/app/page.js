'use client'  
import Link from "next/link"
import Boton from "../components/boton"
import Tarjeta from "../components/tarjeta"
import Footer from "../components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-tertiary">
      {/* Header mejorado */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-primary cursor-pointer hover:text-quinary transition-colors duration-300">
                  Don Nicola
                </h1>
              </div>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="#inicio"
                  className="text-quaternary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-tertiary"
                >
                  Inicio
                </Link>
                <Link
                  href="#servicios"
                  className="text-quaternary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-tertiary"
                >
                  Servicios
                </Link>
                <Link
                  href="#nosotros"
                  className="text-quaternary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-tertiary"
                >
                  Nosotros
                </Link>
                <Link
                  href="#contacto"
                  className="text-quaternary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-tertiary"
                >
                  Contacto
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section mejorado */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-quinary text-white overflow-hidden">
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
              <Boton variant="quaternary" size="large" className="shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                Explora nuestros productos
              </Boton>
              <Boton variant="outlineQuaternary" size="large" className="border-white text-white hover:bg-white hover:text-primary shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                Encuentra tu sucursal
              </Boton>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características mejorada */}
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

      {/* Stats Section mejorado */}
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

      {/* CTA Section mejorado */}
      <section className="py-24 bg-gradient-to-br from-quaternary to-quinary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo para descubrir?</h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Únete a cientos de clientes que ya confían en Don Nicola para disfrutar 
            de los mejores quesos artesanales con sabor auténtico.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Boton variant="outlineSecondary" size="large" className="border-white text-white hover:bg-white hover:text-primary shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              Contáctanos por WhatsApp
            </Boton>
            <Boton variant="quaternary" size="large" className="shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              Visita nuestras sucursales
            </Boton>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
