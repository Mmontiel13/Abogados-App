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
  initialData?: { // Interfaz simplificada para initialData
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    dateAdded?: string;
  }
}

// En OtrosDashboard.tsx o donde hagas la llamada a la API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://abogados-app-backend-production.up.railway.app";

// Luego, en tu fetch:
// const response = await fetch(`${BACKEND_URL}/others`);

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

  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    // setIsFormOpen(true) // Comentado para Canvas

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        // setIsFormOpen(false) // Comentado para Canvas
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
      // setIsFormOpen(false) // Comentado para Canvas
    }
  }, [onClose]) // Dependencias ajustadas


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    const isEditing = !!initialData;
    const url = isEditing ? `${BACKEND_URL}/cliente/${initialData.id}` : `${BACKEND_URL}/cliente`;
    const method = "POST"; // Siempre POST para enviar FormData con _method=PUT

    // **MODIFICACIÓN 1: Validación - Solo 'name' es obligatorio**
    if (!formData.name.trim()) { // Usar .trim() para evitar nombres solo con espacios en blanco
      setSubmitError("El campo 'Nombre' es requerido.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('dateAdded', format(date!, "yyyy-MM-dd")); // Formato consistente con el backend

    // Asegurarse de enviar el ID para la edición si está presente
    if (isEditing && initialData.id) {
      // payload.append('id', initialData.id); // No se envía el ID en el payload, se usa en la URL
    }

    if (isEditing) {
      payload.append("_method", "PUT"); // Simula el método PUT para la actualización
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: payload,
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccessMessage(responseData.message || "Operación exitosa.");
        onSubmit(responseData); // Llama al callback del padre
        // onClose(); // Cierra el formulario aquí después de un éxito si el padre no lo maneja
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {initialData?.id && (
                <div className="space-y-2">
                  <Label htmlFor="clientId">ID Cliente</Label>
                  <Input
                    id="clientId"
                    value={initialData.id}
                    disabled
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Nombre del cliente */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del cliente *</Label>
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              {/* Número de teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Número de teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+52 123 456 7890"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
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
                  setIsFormOpen(false) // Comentado para Canvas
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
