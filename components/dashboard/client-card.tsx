"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, Mail, ChevronRight, User } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  status: string
  caseCount: number
  type: string
}

interface ClientCardProps {
  client: Client
  onClick?: () => void
}

export default function ClientCard({ client, onClick }: ClientCardProps) {
  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactivo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pendiente":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-all duration-300 border-gray-200 hover:border-blue-200 cursor-pointer h-fit"
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-2 sm:p-3 border-b border-gray-100">
        <div className="text-center">
          <div className="text-base sm:text-lg font-bold text-blue-800">{client.id}</div>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div>
            <div className="text-xs text-gray-500 mb-1">Nombre del Cliente</div>
            <div className="font-medium text-gray-900 line-clamp-2 flex items-center gap-2">
              <User className="h-3 w-3 text-gray-400" />
              {client.name}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 flex-shrink-0" />
            <div className="text-gray-600 text-xs sm:text-sm">{new Date(client.dateAdded).toLocaleDateString()}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Contacto</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-400" />
                <div className="text-gray-700 line-clamp-1 text-xs">{client.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-gray-400" />
                <div className="text-gray-700 text-xs">{client.phone}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Badge className={`font-normal text-xs ${getStatusColor(client.status)}`}>{client.status}</Badge>
          </div>

          <div className="pt-1">
            <div className="text-xs text-gray-500 mb-1">Expedientes</div>
            <div className="text-gray-700">{client.caseCount} casos activos</div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 h-7 sm:h-8 text-xs sm:text-sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle view details action
            }}
          >
            Ver Perfil
            <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
