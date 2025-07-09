"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Save, X } from "lucide-react" // Eliminado Upload
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useFormContext } from "./form-provider"

interface OtrosFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}

export default function OtrosForm({ onClose, onSubmit, initialData }: OtrosFormProps) {
  const { setIsFormOpen } = useFormContext()
  const [date, setDate] = useState<Date | undefined>(
    initialData?.dateAdded ? new Date(initialData.dateAdded) : new Date(),
  )
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "",
    description: initialData?.description || "",
    author: initialData?.author || "",
    tags: initialData?.tags?.join(", ") || "",
    // Eliminados: source, jurisdiction, court, caseNumber, year
    notes: initialData?.notes || "",
  })

  // Eliminadas las variables de estado para la subida de archivos
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  // ...
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        type: initialData.type || "",
        description: initialData.description || "",
        author: initialData.author || "",
        tags: initialData.tags?.join(", ") || "",
        // Eliminados: source, jurisdiction, court, caseNumber, year
        notes: initialData.notes || "",
      });
      setDate(initialData.dateAdded ? new Date(initialData.dateAdded) : undefined);
    } else {
      setFormData({
        title: "",
        type: "",
        description: "",
        author: "",
        tags: "",
        // Eliminados: source, jurisdiction, court, caseNumber, year
        notes: "",
      });
      setDate(new Date());
    }
  }, [initialData]);
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // En OtrosDashboard.tsx o donde hagas la llamada a la API
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://abogados-app-backend-production.up.railway.app";

  // Luego, en tu fetch:
  // const response = await fetch(`${BACKEND_URL}/others`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    const isEditing = !!initialData;
    const url = isEditing ? `${BACKEND_URL}/other/${initialData.id}` : `${BACKEND_URL}/other`;
    const method = "POST"; // Usar PUT para edición directa

    // Validaciones básicas
    if (!formData.title || !formData.type || !formData.description || !date) {
      let missingFields = [];
      if (!formData.title) missingFields.push('Título');
      if (!formData.type) missingFields.push('Tipo');
      if (!formData.description) missingFields.push('Descripción');
      if (!date) missingFields.push('Fecha');

      setSubmitError(`Por favor, completa todos los campos obligatorios: ${missingFields.join(', ')}.`);
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('type', formData.type);
    payload.append('description', formData.description);
    payload.append('author', formData.author);
    payload.append('tags', formData.tags);
    // Eliminados: source, jurisdiction, court, caseNumber, year
    payload.append('notes', formData.notes);
    payload.append('date', format(date!, "yyyy-MM-dd"));

    // No se adjuntan archivos al payload aquí
    if (isEditing) {
      payload.append("_method", "PUT");
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: payload,
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccessMessage(responseData.message || "Operación exitosa.");
        onSubmit(responseData); // Notifica al componente padre
        onClose(); // Cierra el formulario
      } else {
        setSubmitError(responseData.error || `Error al procesar la solicitud: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setSubmitError("No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
    } finally {
      setSubmitting(false);
    }
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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{initialData ? "Editar Archivo" : "Crear Otro Archivo"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Nombre del archivo"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)} required>
                  <SelectTrigger id="type" className="w-full">
                    <div className="flex items-center">
                      <span className="mr-2">≡</span>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formato">Formato</SelectItem>
                    <SelectItem value="Jurisprudencia">Jurisprudencia</SelectItem>
                    <SelectItem value="Plantilla">Plantilla</SelectItem>
                    <SelectItem value="Documento">Documento</SelectItem>
                    <SelectItem value="Tesis">Tesis</SelectItem>
                    <SelectItem value="Criterio">Criterio</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Autor */}
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  placeholder="Nombre del autor"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                />
              </div>

              {/* Fecha que se agregó */}
              <div className="space-y-2">
                <Label htmlFor="date">Fecha que se agregó</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                  </PopoverContent>
                </Popover>
              </div>

            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Descripción detallada del archivo"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                required
              />
            </div>

            {/* Etiquetas */}
            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas</Label>
              <Input
                id="tags"
                placeholder="Civil, Demanda, Plantilla (separadas por comas)"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
              />
            </div>

            {/* Notas adicionales */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                placeholder="Información adicional sobre el documento"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={2}
              />
            </div>

            {/* Eliminado: Sección "Agregar Documentos" */}
            {/* <div className="space-y-2">
              <Label>Agregar Documentos</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                <div className="text-gray-400 mb-2">
                  <div className="w-20 h-20 mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-gray-400"
                    >
                      <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-3.08" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M12 18v-6" />
                      <path d="m9 15 3 3 3-3" />
                    </svg>
                  </div>
                </div>
                <Button variant="outline" type="button" className="mt-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Seleccionar archivos
                </Button>
              </div>
            </div> */}

            {/* Mensajes de feedback */}
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                {submitError}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center">
                {successMessage}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {initialData ? "Actualizar" : "Guardar"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose()
                  setIsFormOpen(false)
                }}
                className="bg-gray-800 text-white hover:bg-gray-700 px-8 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
