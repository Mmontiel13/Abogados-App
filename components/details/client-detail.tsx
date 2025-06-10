"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, User, Phone, Mail, Calendar, FileText } from "lucide-react"
import { useFormContext } from "../forms/form-provider"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  status: string
  caseCount: number
  cases?: Array<{
    id: string
    title: string
    date: string
    status: string
  }>
}

interface ClientDetailProps {
  client: Client
  onClose: () => void
  onEdit?: (client: any) => void
}

export default function ClientDetail({ client, onClose, onEdit }: ClientDetailProps) {
  const { setIsFormOpen } = useFormContext()

  // Sample cases if not provided
  const cases = client.cases || [
    {
      id: "2023/001",
      title: "Divorcio Contencioso",
      date: "2023-11-15",
      status: "En Proceso",
    },
    {
      id: "2023/003",
      title: "Contrato Mercantil",
      date: "2023-11-08",
      status: "Revisión",
    },
    {
      id: "2023/006",
      title: "Custodia Menor",
      date: "2023-11-01",
      status: "Cerrado",
    },
  ]

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactivo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pendiente":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "en proceso":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "revisión":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "cerrado":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  useEffect(() => {
    setIsFormOpen(true)

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        setIsFormOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
      setIsFormOpen(false)
    }
  }, [onClose, setIsFormOpen])

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
          setIsFormOpen(false)
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <div className="text-sm text-gray-500">Cliente #{client.id}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onClose()
                setIsFormOpen(false)
              }}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Estado</div>
                <Badge className={`font-normal ${getStatusColor(client.status)}`}>{client.status}</Badge>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Fecha de registro</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(client.dateAdded).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Correo electrónico</div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{client.email}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Teléfono</div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Expedientes activos</div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span>{client.caseCount} expedientes</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="cases" className="mt-6">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="cases">Expedientes</TabsTrigger>
            </TabsList>
            <TabsContent value="cases" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cases.map((caseItem) => (
                      <tr key={caseItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{caseItem.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{caseItem.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(caseItem.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={`font-normal ${getStatusColor(caseItem.status)}`}>{caseItem.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                onClose()
                setIsFormOpen(false)
              }}
              className="px-8 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cerrar
            </Button>
            {onEdit && (
              <Button
                onClick={() => {
                  onEdit(client)
                  setIsFormOpen(false)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
