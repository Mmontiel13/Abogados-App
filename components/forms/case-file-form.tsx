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

interface CaseFileFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}

export default function CaseFileForm({ onClose, onSubmit, initialData }: CaseFileFormProps) {
  const { setIsFormOpen } = useFormContext()
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : new Date())
  const [formData, setFormData] = useState({
    caseNumber: initialData?.id || "",
    title: initialData?.title || "",
    subject: initialData?.matter || "",
    clientId: initialData?.client || "",
    state: initialData?.status || "",
    court: initialData?.court || "",
    description: initialData?.description || "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      dateAdded: date,
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{initialData ? "Editar Expediente" : "Formulario Expediente"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Número de expediente */}
              <div className="space-y-2">
                <Label htmlFor="caseNumber">Número de expediente</Label>
                <Input
                  id="caseNumber"
                  placeholder="Nombre"
                  value={formData.caseNumber}
                  onChange={(e) => handleChange("caseNumber", e.target.value)}
                  required
                />
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título del expediente"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Materia */}
              <div className="space-y-2">
                <Label htmlFor="subject">Materia</Label>
                <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)}>
                  <SelectTrigger id="subject" className="w-full">
                    <div className="flex items-center">
                      <span className="mr-2">≡</span>
                      <SelectValue placeholder="Materias" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Derecho Civil">Derecho Civil</SelectItem>
                    <SelectItem value="Derecho Penal">Derecho Penal</SelectItem>
                    <SelectItem value="Derecho Familiar">Derecho Familiar</SelectItem>
                    <SelectItem value="Derecho Mercantil">Derecho Mercantil</SelectItem>
                    <SelectItem value="Derecho Laboral">Derecho Laboral</SelectItem>
                  </SelectContent>
                </Select>
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

              {/* Cliente Asociado */}
              <div className="space-y-2">
                <Label htmlFor="client">Cliente Asociado</Label>
                <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
                  <SelectTrigger id="client" className="w-full">
                    <div className="flex items-center">
                      <span className="mr-2">👤</span>
                      <SelectValue placeholder="Lista de clientes" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="María González Pérez">María González Pérez</SelectItem>
                    <SelectItem value="Carlos Rodríguez López">Carlos Rodríguez López</SelectItem>
                    <SelectItem value="Empresa ABC S.A. de C.V.">Empresa ABC S.A. de C.V.</SelectItem>
                    <SelectItem value="Ana Martínez Silva">Ana Martínez Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                  <SelectTrigger id="state" className="w-full">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <SelectValue placeholder="Lista de estados" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Abierto">Abierto</SelectItem>
                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                    <SelectItem value="Revisión">Revisión</SelectItem>
                    <SelectItem value="Cerrado">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Juzgado */}
              <div className="space-y-2">
                <Label htmlFor="court">Juzgado</Label>
                <Select value={formData.court} onValueChange={(value) => handleChange("court", value)}>
                  <SelectTrigger id="court" className="w-full">
                    <div className="flex items-center">
                      <span className="mr-2">≡</span>
                      <SelectValue placeholder="Lista de Juzgados" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Juzgado 1° Civil">Juzgado 1° Civil</SelectItem>
                    <SelectItem value="Juzgado 2° Familiar">Juzgado 2° Familiar</SelectItem>
                    <SelectItem value="Juzgado 3° Penal">Juzgado 3° Penal</SelectItem>
                    <SelectItem value="Juzgado 1° Laboral">Juzgado 1° Laboral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción del expediente"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
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
