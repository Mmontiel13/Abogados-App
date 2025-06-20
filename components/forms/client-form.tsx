"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Save, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useFormContext } from "./form-provider"

interface ClientFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}

export default function ClientForm({ onClose, onSubmit, initialData }: ClientFormProps) {
  const { setIsFormOpen } = useFormContext()
  const [date, setDate] = useState<Date | undefined>(
    initialData?.dateAdded ? new Date(initialData.dateAdded) : new Date(),
  )
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
  })

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      dateAdded: date ? date.toISOString() : null,
    })
    setIsFormOpen(false)
  }

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto form-modal">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{initialData ? "Editar Cliente" : "Formulario Cliente"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre del cliente */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del cliente *</Label>
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Número de teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Número de teléfono *</Label>
                <Input
                  id="phone"
                  placeholder="+52 123 456 7890"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
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
