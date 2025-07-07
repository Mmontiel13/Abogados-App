"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, FileText, Calendar, User, Tag, Book, Gavel, Hash, Clock, FolderOpen } from "lucide-react" // Añadido FolderOpen
import { useFormContext } from "../forms/form-provider"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

interface OtrosItem {
  id: string
  title: string
  dateAdded: string
  type: string
  description: string
  author?: string
  tags?: string[]
  source?: string;
  jurisdiction?: string;
  court?: string;
  caseNumber?: string;
  year?: string;
  notes?: string;
  googleDriveFolderId?: string; // Nuevo campo para el ID de la carpeta de Drive
}

interface OtrosDetailProps {
  item: OtrosItem
  onClose: () => void
  onEdit?: (item: any) => void
}

const GOOGLE_DRIVE_FOLDER_BASE_URL = "https://drive.google.com/drive/folders/" // URL para abrir carpetas


export default function OtrosDetail({ item, onClose, onEdit }: OtrosDetailProps) {
  const { setIsFormOpen } = useFormContext()

  // Handle opening Google Drive folder
  const handleOpenDriveFolder = (folderId: string) => {
    window.open(`${GOOGLE_DRIVE_FOLDER_BASE_URL}${folderId}`, "_blank");
  };

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
                <div className="text-sm text-gray-500">Archivo #{item.id}</div>
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

          {/* Sección de detalles del archivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Tipo</div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span>{item.type}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Fecha de creación</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{item.dateAdded ? format(new Date(item.dateAdded), "dd MMMM yyyy", { locale: es }) : "N/A"}</span>
              </div>
            </div>
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
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-gray-400" />
                  <span>{item.source}</span>
                </div>
              </div>
            )}
            {item.jurisdiction && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Jurisdicción</div>
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-gray-400" />
                  <span>{item.jurisdiction}</span>
                </div>
              </div>
            )}
            {item.court && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Tribunal</div>
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-gray-400" />
                  <span>{item.court}</span>
                </div>
              </div>
            )}
            {item.caseNumber && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Número de Expediente</div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span>{item.caseNumber}</span>
                </div>
              </div>
            )}
            {item.year && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Año</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{item.year}</span>
                </div>
              </div>
            )}
          </div>

          {item.description && (
            <div className="mb-6 py-4">
              <div className="text-sm text-gray-500 mb-1">Descripción</div>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">{item.description}</div>
            </div>
          )}

          {item.notes && (
            <div className="mb-6 py-4">
              <div className="text-sm text-gray-500 mb-1">Notas Adicionales</div>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">{item.notes}</div>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mb-6 py-4">
              <div className="text-sm text-gray-500 mb-1">Etiquetas</div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-100 text-gray-700">
                    <Tag className="h-3 w-3 mr-1" /> {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Tabs defaultValue="documents" className="mt-2">
            <TabsList className="grid w-full grid-cols-1"> {/* Solo una pestaña para documentos */}
              <TabsTrigger value="documents">Documentos de Google Drive</TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="mt-2">
              <div className="border rounded-lg overflow-hidden p-4 text-center bg-gray-50">
                <p className="text-sm text-gray-600 mb-4">
                  Para ver, agregar o gestionar documentos, utiliza la carpeta de Google Drive asociada a este archivo.
                </p>
                {item.googleDriveFolderId ? (
                  <Button
                    onClick={() => handleOpenDriveFolder(item.googleDriveFolderId!)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 flex items-center justify-center mx-auto gap-2 rounded-md"
                  >
                    <FolderOpen className="h-5 w-5" />
                    Ver o agregar documentos
                  </Button>
                ) : (
                  <p className="text-red-500 text-sm">No se encontró una carpeta de Google Drive asociada a este archivo.</p>
                )}
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
