"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, FileText, Calendar, User, Tag, Book, Gavel, Hash, Clock, Eye, Download, FolderOpen } from "lucide-react" // Añadido FolderOpen
import { useFormContext } from "../forms/form-provider"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

// Interfaz para los documentos de Google Drive
interface DriveDocument {
  id: string; // El ID de Google Drive
  name: string; // El nombre original del archivo
  mimeType?: string; // Tipo MIME del archivo
  size?: string; // Tamaño del archivo en bytes (como string o number)
}

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

// URLs base para Google Drive
const GOOGLE_DRIVE_VIEW_BASE_URL = "https://drive.google.com/file/d/"
const GOOGLE_DRIVE_DOWNLOAD_BASE_URL = "https://drive.google.com/uc?id="
const GOOGLE_DRIVE_FOLDER_BASE_URL = "https://drive.google.com/drive/folders/" // URL para abrir carpetas

// En OtrosDashboard.tsx o donde hagas la llamada a la API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Luego, en tu fetch:
// const response = await fetch(`${BACKEND_URL}/others`);

export default function OtrosDetail({ item, onClose, onEdit }: OtrosDetailProps) {
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
      if (!item.googleDriveFolderId) {
        setDriveDocuments([]);
        setLoadingDriveDocuments(false);
        setErrorDriveDocuments("No hay una carpeta de Google Drive asociada para este archivo.");
        return;
      }

      setLoadingDriveDocuments(true);
      setErrorDriveDocuments(null);
      try {
        const response = await fetch(`${BACKEND_URL}/other/${item.id}/documents`);
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
  }, [item.id, item.googleDriveFolderId]); // Dependencias para recargar cuando cambie el item o su ID de carpeta

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
              {item.googleDriveFolderId && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Para agregar o gestionar documentos, sube o edita directamente en Google Drive:
                  </p>
                  <Button
                    onClick={() => handleOpenDriveFolder(item.googleDriveFolderId!)}
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
