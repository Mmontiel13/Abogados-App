"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, User, Phone, Mail, Calendar, FileText, ChevronRight } from "lucide-react" // Añadido ChevronRight
import { useFormContext } from "../forms/form-provider"

// Interfaz para los expedientes asociados al cliente
interface ClientCase {
  id: string;
  title: string;
  // Puedes añadir más campos si los necesitas en la lista aquí
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  activo?: boolean // Usar 'activo' en lugar de 'status' para consistencia con el backend
}

interface ClientDetailProps {
  client: Client
  onClose: () => void
  onEdit?: (client: any) => void
  onViewCaseDetail: (caseId: string) => void; // Prop para abrir el detalle del expediente
}

export default function ClientDetail({ client, onClose, onEdit, onViewCaseDetail }: ClientDetailProps) {
  const { setIsFormOpen } = useFormContext()
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [loadingClientCases, setLoadingClientCases] = useState(true);
  const [errorClientCases, setErrorClientCases] = useState<string | null>(null);

  const getStatusColor = (activo?: boolean) => {
    if (activo === true) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (activo === false) {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200"; // Por defecto
  }

  // Cargar los expedientes asociados al cliente
  useEffect(() => {
    const fetchClientCases = async () => {
      setLoadingClientCases(true);
      setErrorClientCases(null);
      try {
        const response = await fetch(`http://localhost:8000/cases/client/${client.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ClientCase[] = await response.json();
        setClientCases(data);
      } catch (error: any) {
        console.error("Error al cargar expedientes del cliente:", error);
        setErrorClientCases(`Error al cargar expedientes: ${error.message}.`);
      } finally {
        setLoadingClientCases(false);
      }
    };

    if (client.id) { // Asegurarse de tener un client.id antes de intentar la carga
      fetchClientCases();
    }
  }, [client.id]);
    
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
                <Badge className={`font-normal ${getStatusColor(client.activo)}`}>
                  {client.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Fecha de registro</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{client.dateAdded ? new Date(client.dateAdded).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4"> {/* Agrupados los campos de contacto */}
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
          </div>

          {/* Sección de Expedientes Asociados */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expedientes Asociados</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              {loadingClientCases && <p className="text-center py-4 text-gray-600">Cargando expedientes...</p>}
              {errorClientCases && <p className="text-center py-4 text-red-500">{errorClientCases}</p>}
              {!loadingClientCases && !errorClientCases && clientCases.length === 0 && (
                <p className="text-center py-4 text-gray-600">Este cliente no tiene expedientes asociados.</p>
              )}
              {!loadingClientCases && !errorClientCases && clientCases.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {clientCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => onViewCaseDetail(caseItem.id)} // Asegura que el clic funciona
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 text-base">{caseItem.title}</div>
                          <div className="text-sm text-gray-500">Expediente #{caseItem.id}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
