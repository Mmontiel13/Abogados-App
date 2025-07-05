"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, FileText, Calendar, User, MapPin, Scale, Clock, Eye, Download, FolderOpen } from "lucide-react"
import { useFormContext } from "../forms/form-provider"
import { format } from "date-fns" // Para formatear la fecha
import { es } from "date-fns/locale" // Para formatear la fecha en español

// Interfaz para los documentos de Google Drive (ahora incluyen mimeType y size)
interface DriveDocument {
  id: string; // El ID de Google Drive
  name: string; // El nombre original del archivo
  mimeType?: string; // Tipo MIME del archivo
  size?: string; // Tamaño del archivo en bytes (como string o number)
}

interface CaseFile {
  id: string
  title: string
  date: string
  clientId: string
  place: string
  subject: string
  court: string
  description?: string
  documents?: DriveDocument[] // Ahora es un array de objetos DriveDocument (se poblará desde la API de Drive)
  history?: Array<{
    id: string
    date: string
    action: string
    user: string
  }>
  googleDriveFolderId?: string; // Nuevo campo para el ID de la carpeta de Drive
}

interface CaseFileDetailProps {
  caseFile: CaseFile
  onClose: () => void
  onEdit?: (caseFile: any) => void
}

// URLs base para Google Drive
const GOOGLE_DRIVE_VIEW_BASE_URL = "https://drive.google.com/file/d/"
const GOOGLE_DRIVE_DOWNLOAD_BASE_URL = "https://drive.google.com/uc?id="
const GOOGLE_DRIVE_FOLDER_BASE_URL = "https://drive.google.com/drive/folders/"

export default function CaseFileDetail({ caseFile, onClose, onEdit }: CaseFileDetailProps) {
  const { setIsFormOpen } = useFormContext()

  const [driveDocuments, setDriveDocuments] = useState<DriveDocument[]>([]);
  const [loadingDriveDocuments, setLoadingDriveDocuments] = useState(true);
  const [errorDriveDocuments, setErrorDriveDocuments] = useState<string | null>(null);

  // Función para formatear el tamaño del archivo
  const formatBytes = (bytes: string | number | undefined, decimals = 2) => {
    if (bytes === 0 || bytes === undefined) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(Number(bytes)) / Math.log(k));
    return parseFloat((Number(bytes) / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Handle opening document in new tab
  const handleViewDocument = (documentId: string) => {
    window.open(`${GOOGLE_DRIVE_VIEW_BASE_URL}${documentId}/view`, "_blank")
  }

  // Handle downloading document
  const handleDownloadDocument = (documentId: string) => {
    window.open(`${GOOGLE_DRIVE_DOWNLOAD_BASE_URL}${documentId}&export=download`, "_blank")
  }

  // Handle opening Google Drive folder
  const handleOpenDriveFolder = (folderId: string) => {
    window.open(`${GOOGLE_DRIVE_FOLDER_BASE_URL}${folderId}`, "_blank");
  };


  // Efecto para cargar los documentos de Google Drive
  useEffect(() => {
    const fetchDriveDocuments = async () => {
      if (!caseFile.googleDriveFolderId) {
        setDriveDocuments([]);
        setLoadingDriveDocuments(false);
        setErrorDriveDocuments("No hay una carpeta de Google Drive asociada para este expediente.");
        return;
      }

      setLoadingDriveDocuments(true);
      setErrorDriveDocuments(null);
      try {
        const response = await fetch(`http://localhost:8000/case/${caseFile.id}/documents`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DriveDocument[] = await response.json();
        setDriveDocuments(data);
      } catch (error: any) {
        console.error("Error al cargar documentos de Google Drive:", error);
        setErrorDriveDocuments(`Error al cargar documentos: ${error.message}.`);
      } finally {
        setLoadingDriveDocuments(false);
      }
    };

    fetchDriveDocuments();
  }, [caseFile.id, caseFile.googleDriveFolderId]); // Dependencias para recargar cuando cambie el expediente o su ID de carpeta

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
              <div className="border rounded-lg overflow-hidden">
                {loadingDriveDocuments && <p className="text-center py-4 text-gray-600">Cargando documentos de Drive...</p>}
                {errorDriveDocuments && <p className="text-center py-4 text-red-500">{errorDriveDocuments}</p>}
                {!loadingDriveDocuments && !errorDriveDocuments && driveDocuments.length === 0 && (
                  <p className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay documentos adjuntos en Google Drive.
                  </p>
                )}
                {!loadingDriveDocuments && !errorDriveDocuments && driveDocuments.length > 0 && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre de archivo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tamaño
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {driveDocuments.map((doc) => (
                        <tr key={doc.id}>
                          <td className="px-4 py-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900 truncate">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 whitespace-nowrap text-sm text-gray-500">
                            {formatBytes(doc.size)}
                          </td>
                          <td className="px-4 py-6 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewDocument(doc.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownloadDocument(doc.id)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {caseFile.googleDriveFolderId && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Para agregar o gestionar documentos, sube o edita directamente en Google Drive:
                  </p>
                  <Button
                    onClick={() => handleOpenDriveFolder(caseFile.googleDriveFolderId!)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 flex items-center justify-center mx-auto gap-2 rounded-md"
                  >
                    <FolderOpen className="h-5 w-5" />
                    Abrir Carpeta en Google Drive
                  </Button>
                </div>
              )}
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
