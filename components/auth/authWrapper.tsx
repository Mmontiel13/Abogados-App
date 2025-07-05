"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Importar usePathname

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname(); // Obtener la ruta actual
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Define las rutas que son públicas y no requieren autenticación
  const publicPaths = ['/login', '/register']; // Añadir /register si es una ruta separada

  useEffect(() => {
    const checkAuth = () => {
      // Si la ruta actual es una ruta pública, no necesitamos verificar la autenticación
      if (publicPaths.includes(pathname)) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const loggedInUser = localStorage.getItem('loggedInUser');
      
      if (loggedInUser) {
        setIsAuthenticated(true);
      } else {
        // Si no hay usuario y no estamos en una ruta pública, redirigir a login
        console.log("Usuario no autenticado. Redirigiendo a la página de login.");
        router.push('/login'); 
      }
      setIsLoading(false);
    };

    checkAuth();

    // Dependencias: pathname para re-evaluar si la ruta cambia (ej. de login a dashboard)
    // router: para asegurar que router.push es estable
  }, [pathname, router]); 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Verificando autenticación...</p>
      </div>
    );
  }

  // Si no está autenticado Y NO estamos en una ruta pública (ya se redirigió), no renderizamos nada.
  // Si estamos en una ruta pública, isAuthenticated será true y se renderizará children.
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return null; 
  }

  return <>{children}</>;
}
