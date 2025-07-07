"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebar"
import Navigation from "./navigation"
import CategoryTabs from "./category-tabs"
import ClientCard from "./client-card"
import ClientDetail from "../details/client-detail"
import ClientForm from "../forms/client-form"
import { FormProvider } from "../forms/form-provider"
import CaseFileDetail from "../details/case-file-detail"

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateAdded: string; // Formato YYYY-MM-DD
  activo?: boolean; // Para gestionar el estado activo/inactivo desde Firebase
}

interface CaseFile {
  id: string;
  title: string;
  date: string;
  clientId: string;
  place: string;
  subject: string;
  court: string;
  description?: string;
  documents?: string[];
  history?: Array<{
    id: string;
    date: string;
    action: string;
    user: string;
  }>;
}

// En OtrosDashboard.tsx o donde hagas la llamada a la API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Luego, en tu fetch:
// const response = await fetch(`${BACKEND_URL}/others`);

export default function ClientsDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("todos")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showClientForm, setShowClientForm] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)

  // Estado para almacenar los clientes de la API
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [errorClients, setErrorClients] = useState<string | null>(null)
  const [selectedCaseFile, setSelectedCaseFile] = useState<CaseFile | null>(null);
  
  // Definición de categorías ajustadas a los nuevos campos (solo Todos, Activos, Inactivos)
  const categories = [
    { id: "todos", label: "Todos los Clientes", active: true },
    { id: "activos", label: "Activos" },
    { id: "inactivos", label: "Inactivos" },
  ]
  // Función para cargar los clientes desde el backend
  const fetchClients = async () => {
    setLoadingClients(true)
    setErrorClients(null)
    try {
      const response = await fetch(`${BACKEND_URL}/clientes`) // Tu endpoint para listar clientes
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Client[] = await response.json()
      console.log("Clientes recibidos del backend:", data)
      setClients(data) // Actualiza el estado con los datos reales de la API
    } catch (error: any) {
      console.error("Error al cargar clientes:", error)
      setErrorClients(`Error al cargar los clientes: ${error.message}.`)
    } finally {
      setLoadingClients(false)
    }
  }

  // Función para cargar un expediente específico por su ID (para abrir el detalle)
  const fetchCaseFileById = async (caseId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/case/${caseId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CaseFile = await response.json();
      setSelectedCaseFile(data); // Establece el expediente para mostrar su detalle
      setSelectedClient(null); // Cierra el detalle del cliente si estaba abierto
    } catch (error: any) {
      console.error(`Error al cargar el expediente ${caseId}:`, error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClients()
  }, []) // Se ejecuta solo una vez al montar

  // Filtrar clientes en base a la búsqueda y categoría
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) || // Búsqueda por teléfono
      client.id.toLowerCase().includes(searchQuery.toLowerCase()) 

    const matchesCategory = (() => {
      switch (activeCategory) {
        case "todos":
          return true
        case "activos":
          return client.activo === true
        case "inactivos":
          return client.activo === false
        default:
          return true
      }
    })()

    return matchesSearch && matchesCategory
  })

  const handleClientClick = (client: Client) => {
    setSelectedClient(client)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowClientForm(true)
    setSelectedClient(null) // Cierra el detalle si estaba abierto
  }

  // Callback para cuando el formulario de cliente se envía con éxito (creación o edición)
  const handleClientFormSuccess = () => {
    setShowClientForm(false) // Cierra el modal del formulario
    setEditingClient(null) // Limpia el cliente en edición
    setSelectedClient(null); // Asegúrate de cerrar cualquier detalle abierto
    fetchClients(); // Vuelve a cargar los clientes para actualizar el grid
  }

  const handleCreateClient = () => {
    setEditingClient(null); // Asegura que es un formulario nuevo
    setShowClientForm(true);
  };
  
  // Función para cerrar el detalle del expediente
  const handleCloseCaseFileDetail = () => {
    setSelectedCaseFile(null);
  };

  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-64">
          <Navigation
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchExpanded={isSearchExpanded}
            setIsSearchExpanded={setIsSearchExpanded}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        
          {/* Clients Grid */}
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            {loadingClients && <p className="text-center text-gray-600">Cargando clientes...</p>}
            {errorClients && <p className="text-center text-red-500">{errorClients}</p>}
            {!loadingClients && !errorClients && filteredClients.length === 0 && (
              <p className="text-center text-gray-600">No se encontraron clientes.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} onClick={() => handleClientClick(client)} />
              ))}
            </div>
          </div>
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <ClientDetail
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onEdit={handleEditClient}
            onViewCaseDetail={fetchCaseFileById} // Pasa la función para abrir el detalle del expediente
          />
        )}

        {/* Client Form Modal */}
        {showClientForm && (
          <ClientForm
            onClose={() => {
              setShowClientForm(false)
              setEditingClient(null)
            }}
            onSubmit={handleClientFormSuccess}
            initialData={editingClient}
          />
        )}

        {/* Case File Detail Modal (para mostrar el detalle de un expediente desde el detalle del cliente) */}
        {selectedCaseFile && (
          <CaseFileDetail
            caseFile={selectedCaseFile}
            onClose={handleCloseCaseFileDetail}
          />
        )}
      </div>
    </FormProvider>
  )
}
