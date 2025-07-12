import Link from "next/link";
import "../app/globals.css";
import { useState } from "react";

export default function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());

    return (
        <footer className="bg-gray-800 text-white py-12">
        <div className="flex flex-col px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-around">
            <div>
              <h3 className="text-lg font-semibold mb-4">Don Nicola</h3>
              <p className="text-gray-400">
                La pasión por la calidad y nuestra tradición familiar.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@miempresa.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Calle Principal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {year} Don Nicola. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    )
}