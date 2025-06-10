"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Save, X, Upload } from "lucide-react"
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
    source: initialData?.source || "",
    jurisdiction: initialData?.jurisdiction || "",
    court: initialData?.court || "",
    caseNumber: initialData?.caseNumber || "",
    year: initialData?.year || "",
    notes: initialData?.notes || "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      dateAdded: date,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    })
    setIsFormOpen(false)
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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{initialData ? "Editar Archivo" : "Formulario Otro Archivo"}</h2>
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
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
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

              {/* Fuente (para jurisprudencias) */}
              {(formData.type === "Jurisprudencia" || formData.type === "Tesis" || formData.type === "Criterio") && (
                <div className="space-y-2">
                  <Label htmlFor="source">Fuente</Label>
                  <Select value={formData.source} onValueChange={(value) => handleChange("source", value)}>
                    <SelectTrigger id="source" className="w-full">
                      <div className="flex items-center">
                        <span className="mr-2">⚖️</span>
                        <SelectValue placeholder="Seleccionar fuente" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCJN">Suprema Corte de Justicia de la Nación</SelectItem>
                      <SelectItem value="Tribunal Colegiado">Tribunal Colegiado</SelectItem>
                      <SelectItem value="Tribunal Unitario">Tribunal Unitario</SelectItem>
                      <SelectItem value="Pleno">Pleno</SelectItem>
                      <SelectItem value="Primera Sala">Primera Sala</SelectItem>
                      <SelectItem value="Segunda Sala">Segunda Sala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Jurisdicción */}
              {(formData.type === "Jurisprudencia" || formData.type === "Tesis" || formData.type === "Criterio") && (
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdicción</Label>
                  <Input
                    id="jurisdiction"
                    placeholder="Federal, Local, etc."
                    value={formData.jurisdiction}
                    onChange={(e) => handleChange("jurisdiction", e.target.value)}
                  />
                </div>
              )}

              {/* Tribunal */}
              {(formData.type === "Jurisprudencia" || formData.type === "Tesis" || formData.type === "Criterio") && (
                <div className="space-y-2">
                  <Label htmlFor="court">Tribunal</Label>
                  <Input
                    id="court"
                    placeholder="Nombre del tribunal"
                    value={formData.court}
                    onChange={(e) => handleChange("court", e.target.value)}
                  />
                </div>
              )}

              {/* Número de expediente */}
              {(formData.type === "Jurisprudencia" || formData.type === "Tesis" || formData.type === "Criterio") && (
                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Número de expediente</Label>
                  <Input
                    id="caseNumber"
                    placeholder="Número del expediente"
                    value={formData.caseNumber}
                    onChange={(e) => handleChange("caseNumber", e.target.value)}
                  />
                </div>
              )}

              {/* Año */}
              {(formData.type === "Jurisprudencia" || formData.type === "Tesis" || formData.type === "Criterio") && (
                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input
                    id="year"
                    placeholder="2023"
                    value={formData.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                  />
                </div>
              )}
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

            {/* Agregar Documentos */}
            <div className="space-y-2">
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
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 text-black px-8 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose()
                  setIsFormOpen(false)
                }}
                className="bg-gray-800 text-white hover:bg-gray-700 px-8 flex items-center justify-center gap-2"
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
