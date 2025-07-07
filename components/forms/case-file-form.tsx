"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Save, X } from "lucide-react"
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

interface Client {
  id: string;
  name: string;
}

// En OtrosDashboard.tsx o donde hagas la llamada a la API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Luego, en tu fetch:
// const response = await fetch(`${BACKEND_URL}/others`);

export default function CaseFileForm({ onClose, onSubmit, initialData }: CaseFileFormProps) {
  const { setIsFormOpen } = useFormContext();
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subject: initialData?.subject || "",
    clientId: initialData?.clientId || "none",
    place: initialData?.place || "",
    court: initialData?.court || "",
    description: initialData?.description || "",
  });

  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [errorClients, setErrorClients] = useState<string | null>(null);

  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subject: initialData.subject || "",
        clientId: initialData.clientId || "none", // Asegura que se inicialice a "none" si está vacío/null
        place: initialData.place || "",
        court: initialData.court || "",
        description: initialData.description || "",
      });
      setDate(initialData.date ? new Date(initialData.date) : undefined);
    } else {
      setFormData({
        title: "",
        subject: "",
        clientId: "none", // Valor inicial por defecto para un formulario nuevo
        place: "",
        court: "",
        description: "",
      });
      setSubmitError(null);
      setSuccessMessage(null);
      setDate(new Date());
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      setErrorClients(null);
      try {
        const response = await fetch(`${BACKEND_URL}/clientes`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Client[] = await response.json();
        setClientsList(data);
      } catch (error: any) {
        console.error("Error fetching clients:", error);
        setErrorClients(`Error al cargar clientes: ${error.message}`);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    const isEditing = !!initialData;
    const url = isEditing ? `${BACKEND_URL}/case/${initialData.id}` : `${BACKEND_URL}/case`;
    const method = "POST";

    // Validaciones básicas antes de enviar
    // MODIFICADO: Ahora verifica si clientId es "none"
    if (!formData.title || !formData.subject || formData.clientId === "none" || !date || !formData.place || !formData.court) {
      let missingFields = [];
      if (!formData.title) missingFields.push('Título');
      if (!formData.subject) missingFields.push('Materia');
      if (formData.clientId === "none") missingFields.push('Cliente');
      if (!date) missingFields.push('Fecha');
      if (!formData.place) missingFields.push('Estado Expediente');
      if (!formData.court) missingFields.push('Juzgado');

      console.error("Validation Error: Missing fields:", missingFields.join(', '));
      setSubmitError(`Por favor, completa todos los campos obligatorios: ${missingFields.join(', ')}.`);
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('subject', formData.subject);
    payload.append('clientId', formData.clientId);
    payload.append('court', formData.court);
    payload.append('description', formData.description);
    payload.append('date', format(date!, "yyyy-MM-dd"));
    payload.append('place', formData.place);

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
        onSubmit(responseData);
        onClose();
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
    setIsFormOpen(true);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        setIsFormOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      setIsFormOpen(false);
    };
  }, [onClose, setIsFormOpen]);


  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
          setIsFormOpen(false);
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{initialData ? "Editar Expediente" : "Crear Expediente"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Número de expediente (Solo para visualización en edición, no editable) */}
              <div className="space-y-2">
                <Label htmlFor="caseNumber">Número de expediente</Label>
                <Input
                  id="caseNumber"
                  placeholder="Se asignará automáticamente"
                  value={initialData?.id || "Se asignará automáticamente"}
                  disabled
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
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
                <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)} required>
                  <SelectTrigger id="subject" className="w-full">
                    <div className="flex items-center">
                      <span className="mr-2">≡</span>
                      <SelectValue placeholder="Seleccionar materia" />
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
                <Label htmlFor="date">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
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

              {/* Cliente Asociado (Lista dinámica) */}
              <div className="space-y-2">
                <Label htmlFor="clientId">Cliente Asociado</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => handleChange("clientId", value)}
                  disabled={loadingClients}
                  required
                >
                  <SelectTrigger id="clientId" className="w-full truncate">
                    <div className="flex items-center">
                      <span className="mr-2">👤</span>
                      <SelectValue placeholder="Selecciona un cliente" className="w-full truncate">
                        {/* MODIFICADO: Maneja "none" para mostrar el placeholder */}
                        {formData.clientId === "none"
                          ? "Selecciona un cliente"
                          : clientsList.find((client) => client.id === formData.clientId)?.id || "Cliente no encontrado"
                        }
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {loadingClients && <SelectItem value="loading-clients" disabled>Cargando clientes...</SelectItem>}
                    {errorClients && <SelectItem value="error-clients" disabled>Error al cargar clientes</SelectItem>}
                    <SelectItem value="none">Ninguno</SelectItem> {/* Valor para "Ninguno" */}
                    {!loadingClients && !errorClients && clientsList.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.id}
                      </SelectItem>
                    ))}
                  </SelectContent>

                </Select>
              </div>

              {/* Estado de la República (Campo 'place') */}
              <div className="space-y-2">
                <Label htmlFor="place">Estado de la República</Label>
                <Select value={formData.place} onValueChange={(value) => handleChange("place", value)}>
                  <SelectTrigger id="place" className="w-full">
                    <div className="flex items-center">
                      <span className="mr-2">🗺️</span>
                      <SelectValue placeholder="Seleccionar estado" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AGUASCALIENTES">AGUASCALIENTES</SelectItem>
                    <SelectItem value="BAJA CALIFORNIA">BAJA CALIFORNIA</SelectItem>
                    <SelectItem value="BAJA CALIFORNIA SUR">BAJA CALIFORNIA SUR</SelectItem>
                    <SelectItem value="CAMPECHE">CAMPECHE</SelectItem>
                    <SelectItem value="CHIAPAS">CHIAPAS</SelectItem>
                    <SelectItem value="CHIHUAHUA">CHIHUAHUA</SelectItem>
                    <SelectItem value="COAHUILA">COAHUILA</SelectItem>
                    <SelectItem value="COLIMA">COLIMA</SelectItem>
                    <SelectItem value="CIUDAD DE MÉXICO">CIUDAD DE MÉXICO</SelectItem>
                    <SelectItem value="DURANGO">DURANGO</SelectItem>
                    <SelectItem value="GUANAJUATO">GUANAJUATO</SelectItem>
                    <SelectItem value="GUERRERO">GUERRERO</SelectItem>
                    <SelectItem value="HIDALGO">HIDALGO</SelectItem>
                    <SelectItem value="JALISCO">JALISCO</SelectItem>
                    <SelectItem value="MÉXICO">MÉXICO</SelectItem>
                    <SelectItem value="MICHOACAN">MICHOACAN</SelectItem>
                    <SelectItem value="MORELOS">MORELOS</SelectItem>
                    <SelectItem value="NAYARIT">NAYARIT</SelectItem>
                    <SelectItem value="NUEVO LEÓN">NUEVO LEÓN</SelectItem>
                    <SelectItem value="OAXACA">OAXACA</SelectItem>
                    <SelectItem value="PUEBLA">PUEBLA</SelectItem>
                    <SelectItem value="QUERÉTARO">QUERÉTARO</SelectItem>
                    <SelectItem value="QUINTANA ROO">QUINTANA ROO</SelectItem>
                    <SelectItem value="SAN LUIS POTOSÍ">SAN LUIS POTOSÍ</SelectItem>
                    <SelectItem value="SINALOA">SINALOA</SelectItem>
                    <SelectItem value="SONORA">SONORA</SelectItem>
                    <SelectItem value="TABASCO">TABASCO</SelectItem>
                    <SelectItem value="TAMAULIPAS">TAMAULIPAS</SelectItem>
                    <SelectItem value="TLAXCALA">TLAXCALA</SelectItem>
                    <SelectItem value="VERACRUZ">VERACRUZ</SelectItem>
                    <SelectItem value="YUCATÁN">YUCATÁN</SelectItem>
                    <SelectItem value="ZACATECAS">ZACATECAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div> {/* End grid */}

            {/* Juzgado */}
            <div className="space-y-2">
              <Label htmlFor="court">Juzgado</Label>
              <Select value={formData.court} onValueChange={(value) => handleChange("court", value)}>
                <SelectTrigger id="court" className="w-full">
                  <div className="flex items-center">
                    <span className="mr-2">🏛️</span>
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
                  onClose();
                  setIsFormOpen(false);
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
  );
}
