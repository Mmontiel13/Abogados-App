"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, FileText, Calendar, User, MapPin, Scale, Clock, Eye, Download } from "lucide-react"
import { useFormContext } from "../forms/form-provider"

interface CaseFile {
  id: string
  title: string
  date: string
  client: string
  status: string
  matter: string
  court: string
  description?: string
  documents?: Array<{
    id: string
    name: string
    type: string
    date: string
    size: string
  }>
  history?: Array<{
    id: string
    date: string
    action: string
    user: string
  }>
}

interface CaseFileDetailProps {
  caseFile: CaseFile
  onClose: () => void
  onEdit?: (caseFile: any) => void
}

export default function CaseFileDetail({ caseFile, onClose, onEdit }: CaseFileDetailProps) {
  const { setIsFormOpen } = useFormContext()

  // Sample documents if not provided
  const documents = caseFile.documents || [
    {
      id: "doc1",
      name: "Demanda inicial.pdf",
      type: "PDF",
      date: "2023-11-15",
      size: "1.2 MB",
    },
    {
      id: "doc2",
      name: "Contestación.docx",
      type: "DOCX",
      date: "2023-11-20",
      size: "850 KB",
    },
    {
      id: "doc3",
      name: "Pruebas documentales.pdf",
      type: "PDF",
      date: "2023-11-25",
      size: "3.5 MB",
    },
  ]

  // Sample history if not provided
  const history = caseFile.history || [
    {
      id: "hist1",
      date: "2023-11-15",
      action: "Expediente creado",
      user: "Israel Calva",
    },
    {
      id: "hist2",
      date: "2023-11-20",
      action: "Documento agregado: Demanda inicial.pdf",
      user: "Ana Martínez",
    },
    {
      id: "hist3",
      date: "2023-11-25",
      action: "Estado actualizado a: En Proceso",
      user: "Carlos Rodríguez",
    },
  ]

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "abierto":
        return "bg-green-100 text-green-800 border-green-200"
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
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{caseFile.title}</h2>
                <div className="text-sm text-gray-500">Expediente #{caseFile.id}</div>
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
                <Badge className={`font-normal ${getStatusColor(caseFile.status)}`}>
                  <Clock className="mr-1 h-3 w-3" />
                  {caseFile.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Fecha de creación</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(caseFile.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Cliente asociado</div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{caseFile.client}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Juzgado</div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{caseFile.court}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Materia</div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-gray-400" />
                  <span>{caseFile.matter}</span>
                </div>
              </div>
            </div>
          </div>

          {caseFile.description && (
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Descripción</div>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700">{caseFile.description}</div>
            </div>
          )}

          <Tabs defaultValue="documents" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tamaño
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.user}</td>
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
                  onEdit(caseFile)
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
