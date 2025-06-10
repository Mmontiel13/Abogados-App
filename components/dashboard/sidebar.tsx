"use client"
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
import { ChevronDown, LogOut, User, Settings, Phone, Mail, MapPin, FileText, Users, FolderOpen } from "lucide-react"

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "Israel Calva Corro",
    role: "Abogado Principal",
    avatar: "IC",
    phone: "+52 123 456 7890",
    email: "israel.calva@bufete.com",
  },
  {
    id: 2,
    name: "Ana Martínez",
    role: "Abogada Asociada",
    avatar: "AM",
    phone: "+52 123 456 7891",
    email: "ana.martinez@bufete.com",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    role: "Abogado Junior",
    avatar: "CR",
    phone: "+52 123 456 7892",
    email: "carlos.rodriguez@bufete.com",
  },
]

interface SidebarProps {
  isMobile?: boolean
  className?: string
}

export default function Sidebar({ isMobile = false, className = "" }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    router.push("/login")
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
  ]

  return (
    <div
      className={`bg-gradient-to-b from-blue-900 to-blue-800 text-white ${
        isMobile ? "" : "fixed left-0 top-0 h-full w-64 hidden md:block"
      } ${className}`}
    >
      {/* Logo and User Profile */}
      <div className="p-4 border-b border-blue-700/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-blue-800/50 p-2 rounded-lg transition-all">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarFallback className="bg-blue-700 text-white">IC</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-medium">Israel Calva Corro</div>
                <div className="text-xs text-blue-200">Administrador</div>
              </div>
              <ChevronDown className="h-4 w-4 text-blue-300" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path
            const Icon = item.icon

            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors w-full text-left ${
                  isActive ? "bg-blue-700/50" : "hover:bg-blue-700/30"
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
          <div className="space-y-1">
            {teamMembers.map((member) => (
              <Popover key={member.id}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 p-2 w-full hover:bg-blue-700/30 rounded-lg transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-700 text-white text-xs">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="bg-blue-700 text-white p-4 rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarFallback className="bg-blue-600 text-white">{member.avatar}</AvatarFallback>
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
      </nav>
    </div>
  )
}
