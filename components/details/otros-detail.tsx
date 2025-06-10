"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, Download, FileText, Calendar, User, Eye } from "lucide-react"
import { useFormContext } from "../forms/form-provider"

interface OtrosItem {
  id: string
  title: string
  dateAdded: string
  type: string
  description: string
  author?: string
  tags?: string[]
  source?: string
  jurisdiction?: string
  court?: string
  caseNumber?: string
  year?: string
  notes?: string
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

interface OtrosDetailProps {
  item: OtrosItem
  onClose: () => void
  onEdit?: (item: any) => void
}

export default function OtrosDetail({ item, onClose, onEdit }: OtrosDetailProps) {
  const { setIsFormOpen } = useFormContext()

  // Sample documents if not provided
  const documents = item.documents || [
    {
      id: "doc1",
      name: `${item.title}.pdf`,
      type: "PDF",
      date: item.dateAdded,
      size: "1.2 MB",
    },
    {
      id: "doc2",
      name: "Anexo_1.docx",
      type: "DOCX",
      date: item.dateAdded,
      size: "450 KB",
    },
  ]

  // Sample history if not provided
  const history = item.history || [
    {
      id: "hist1",
      date: item.dateAdded,
      action: "Documento creado",
      user: item.author || "Sistema",
    },
    {
      id: "hist2",
      date: item.dateAdded,
      action: `Archivo agregado: ${item.title}.pdf`,
      user: item.author || "Sistema",
    },
  ]

  // Function to get type badge color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "formato":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "jurisprudencia":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "documento":
        return "bg-green-100 text-green-800 border-green-200"
      case "plantilla":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "tesis":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "criterio":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "manual":
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
                <h2 className="text-2xl font-bold">{item.title}</h2>
                <div className="text-sm text-gray-500">Documento #{item.id}</div>
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
                <div className="text-sm text-gray-500 mb-1">Tipo</div>
                <Badge className={`font-normal ${getTypeColor(item.type)}`}>{item.type}</Badge>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Fecha de creación</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {item.author && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Autor</div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{item.author}</span>
                  </div>
                </div>
              )}
              {item.source && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Fuente</div>
                  <div className="text-gray-700">{item.source}</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {item.year && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Año</div>
                  <div className="text-gray-700">{item.year}</div>
                </div>
              )}
              {item.jurisdiction && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Jurisdicción</div>
                  <div className="text-gray-700">{item.jurisdiction}</div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Descripción</div>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700">{item.description}</div>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">Etiquetas</div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {item.notes && (
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Notas adicionales</div>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700">{item.notes}</div>
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
            <Button variant="outline" className="px-8 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Descargar Todo
            </Button>
            {onEdit && (
              <Button
                onClick={() => {
                  onEdit(item)
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
