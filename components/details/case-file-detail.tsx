"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, FileText, Calendar, User, Scale, FolderOpen } from "lucide-react"
import { useFormContext } from "../forms/form-provider"
import { format } from "date-fns" // Para formatear la fecha
import { es } from "date-fns/locale" // Para formatear la fecha en español


interface CaseFile {
  id: string
  title: string
  date: string
  clientId: string
  place: string
  subject: string
  court: string
  description?: string
  googleDriveFolderId?: string; // Nuevo campo para el ID de la carpeta de Drive
}

interface CaseFileDetailProps {
  caseFile: CaseFile
  onClose: () => void
  onEdit?: (caseFile: any) => void
}

const GOOGLE_DRIVE_FOLDER_BASE_URL = "https://drive.google.com/drive/folders/"

export default function CaseFileDetail({ caseFile, onClose, onEdit }: CaseFileDetailProps) {
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
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Fecha de creación</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {/* Formatear la fecha para una mejor lectura */}
                <span>{caseFile.date ? format(new Date(caseFile.date), "dd MMMM yyyy", { locale: es }) : "N/A"}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Cliente asociado</div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{caseFile.clientId}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Juzgado</div>
              <div className="flex items-center gap-2">
                <span>{caseFile.court}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Materia</div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-gray-400" />
                <span>{caseFile.subject}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Estado de la Republica</div>
              <div className="flex items-center gap-2">
                <span>{caseFile.place}</span>
              </div>
            </div>
          </div>
          {caseFile.description && (
            <div className="mb-2 py-4">
              <div className="text-sm text-gray-500 mb-1">Descripción</div>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700">{caseFile.description}</div>
            </div>
          )}
        </div>

        <Tabs defaultValue="documents" className="mt-2">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>
          <TabsContent value="documents" className="mt-2">
            <div className="border rounded-lg overflow-hidden p-4 text-center bg-gray-50">
              <p className="text-sm text-gray-600 mb-4">
                Para ver, agregar o gestionar documentos, utiliza la carpeta de Google Drive asociada a este expediente.
              </p>
              {caseFile.googleDriveFolderId ? (
                <Button
                  onClick={() => handleOpenDriveFolder(caseFile.googleDriveFolderId!)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 flex items-center justify-center mx-auto gap-2 rounded-md"
                >
                  <FolderOpen className="h-5 w-5" />
                  Ver o agregar documentos
                </Button>
              ) : (
                <p className="text-red-500 text-sm">No se encontró una carpeta de Google Drive asociada a este expediente.</p>
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
  )
}
