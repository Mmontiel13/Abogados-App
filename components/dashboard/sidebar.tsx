"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ChevronDown,
  LogOut,
  Phone,
  Mail,
  FileText,
  Users,
  FolderOpen,
  FileCog,
} from "lucide-react"
import './src/global.css'

// Definir una interfaz para el usuario (similar a cómo viene de tu backend)
interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string; // Opcional, si el backend no lo envía
  phone?: string;
  email: string;
}

interface SidebarProps {
  isMobile?: boolean
  className?: string
}

// En OtrosDashboard.tsx o donde hagas la llamada a la API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://abogados-app-backend2.up.railway.app";

// Luego, en tu fetch:
// const response = await fetch(`${BACKEND_URL}/others`);

export default function Sidebar({ isMobile = false, className = "" }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [errorUsers, setErrorUsers] = useState<string | null>(null)

  // Función para obtener la inicial del avatar
  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true)
    setErrorUsers(null)
    try {
      const response = await fetch(`${BACKEND_URL}/usuarios`) // Endpoint para obtener todos los usuarios
      // const response = await fetch("https://e0719e8a33c8.ngrok-free.app/usuarios")
      // const response = await fetch("http://localhost:8000/usuarios")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // console.log("Datos de usuarios recibidos:", data); // Para depuración

      // Filtrar el usuario logueado de la lista del equipo para evitar duplicados
      const filteredTeamMembers = data.filter((user: User) => user.id !== loggedInUser?.id);
      setTeamMembers(filteredTeamMembers)
    } catch (error: any) {
      console.error("Error fetching users:", error)
      setErrorUsers(`Error al cargar los usuarios: ${error.message}.`)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [loggedInUser]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser'); // Elimina el usuario de localStorage
    // router.push("/login") // Si usas Next.js, descomenta esta línea para la redirección real
    alert("Cerrando sesión. Redirigiendo a la página de login."); // Mensaje de demostración
    // Opcional: Recarga la página para asegurar que el estado se resetee
    window.location.href = '/login'; // O a la ruta de tu login
  }

  const navigationItems = [
    {
      id: "expedientes",
      label: "Expedientes",
      icon: FileText,
      path: "/dashboard",
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: Users,
      path: "/dashboard/clients",
    },
    {
      id: "otros",
      label: "Otros",
      icon: FolderOpen,
      path: "/dashboard/otros",
    },
    {
      id: "blog",
      label: "Administrar Blog",
      icon: FileCog,
      path: "/dashboard/blog",
    },
  ]

  return (
    <div
      className={`bg-gradient-to-b from-blue-900 to-blue-800 text-white ${isMobile ? "h-full" : "fixed left-0 top-0 h-full w-64 hidden md:block"
        } ${className}`}
    >
      {/* Logo and User Profile */}
      <div className="p-4 border-b border-blue-700/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-blue-800/50 p-2 rounded-lg transition-all">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarFallback className="bg-blue-700 text-white">
                  {loggedInUser ? getAvatarFallback(loggedInUser.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-medium">{loggedInUser?.name || "Cargando..."}</div>
                <div className="text-xs text-blue-200">{loggedInUser?.role || "Rol Desconocido"}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-blue-300" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors w-full text-left ${isActive ? "bg-blue-700/50" : "hover:bg-blue-700/30"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Team Section */}
          <div className="mt-8">
            <div className="text-sm font-medium text-blue-200 mb-3 px-2.5">Equipo</div>

            {/* Contenedor con scroll */}
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1 scrollbar-none">
              {teamMembers.map((member) => (
                <Popover key={member.id}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 p-2 w-full hover:bg-blue-700/30 rounded-lg transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-700 text-white text-xs">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <div className="bg-blue-700 text-white p-4 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white/20">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-blue-200">{member.role}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>

        </div>
      </nav>
    </div>
  )
}
