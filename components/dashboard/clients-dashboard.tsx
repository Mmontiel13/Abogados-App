"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebar"
import Navigation from "./navigation"
import CategoryTabs from "./category-tabs"
import ClientCard from "./client-card"
import ClientDetail from "../details/client-detail"
import ClientForm from "../forms/client-form"
import { FormProvider } from "../forms/form-provider"

// Sample data for clients
const clients = [
  {
    id: "CLI-001",
    name: "María González Pérez",
    email: "maria.gonzalez@email.com",
    phone: "+52 123 456 7890",
    dateAdded: "2023-11-15",
    status: "Activo",
    caseCount: 3,
    type: "Persona Física",
    address: "Av. Insurgentes Sur 1234, Col. Del Valle, CDMX",
    rfc: "GOPM850315ABC",
    curp: "GOPM850315MDFNRL09",
    emergencyContact: "Juan González",
    emergencyPhone: "+52 123 456 7899",
    notes: "Cliente frecuente con múltiples casos familiares. Prefiere comunicación por correo electrónico.",
  },
  {
    id: "CLI-002",
    name: "Carlos Rodríguez López",
    email: "carlos.rodriguez@email.com",
    phone: "+52 123 456 7891",
    dateAdded: "2023-11-10",
    status: "Activo",
    caseCount: 1,
    type: "Persona Física",
    address: "Calle Reforma 567, Col. Centro, CDMX",
    rfc: "ROLC800220DEF",
    curp: "ROLC800220HDFNRL05",
  },
  {
    id: "CLI-003",
    name: "Empresa ABC S.A. de C.V.",
    email: "contacto@empresaabc.com",
    phone: "+52 123 456 7892",
    dateAdded: "2023-11-08",
    status: "Activo",
    caseCount: 5,
    type: "Persona Moral",
    address: "Av. Paseo de la Reforma 123, Col. Polanco, CDMX",
    rfc: "EAB950101GHI",
    company: "Empresa ABC S.A. de C.V.",
    position: "Representante Legal",
  },
  {
    id: "CLI-004",
    name: "Ana Martínez Silva",
    email: "ana.martinez@email.com",
    phone: "+52 123 456 7893",
    dateAdded: "2023-11-05",
    status: "Inactivo",
    caseCount: 0,
    type: "Persona Física",
    address: "Calle Juárez 890, Col. Roma Norte, CDMX",
    rfc: "MASA750510JKL",
    curp: "MASA750510MDFNRL02",
  },
  {
    id: "CLI-005",
    name: "Juan López García",
    email: "juan.lopez@email.com",
    phone: "+52 123 456 7894",
    dateAdded: "2023-11-03",
    status: "Pendiente",
    caseCount: 2,
    type: "Persona Física",
    address: "Av. Universidad 456, Col. Narvarte, CDMX",
    rfc: "LOGJ900815MNO",
    curp: "LOGJ900815HDFNRL08",
  },
  {
    id: "CLI-006",
    name: "Constructora XYZ S.A.",
    email: "info@constructoraxyz.com",
    phone: "+52 123 456 7895",
    dateAdded: "2023-11-01",
    status: "Activo",
    caseCount: 4,
    type: "Persona Moral",
    address: "Blvd. Manuel Ávila Camacho 789, Col. Lomas de Chapultepec, CDMX",
    rfc: "CXY980301PQR",
    company: "Constructora XYZ S.A.",
    position: "Director General",
  },
]

const categories = [
  { id: "todos", label: "Todos los Clientes", active: true },
  { id: "fisica", label: "Persona Física" },
  { id: "moral", label: "Persona Moral" },
  { id: "activos", label: "Activos" },
  { id: "inactivos", label: "Inactivos" },
  { id: "pendientes", label: "Pendientes" },
]

export default function ClientsDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("todos")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showClientForm, setShowClientForm] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)

  // Filter clients based on search query and category
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id.includes(searchQuery)

    const matchesCategory = (() => {
      switch (activeCategory) {
        case "todos":
          return true
        case "fisica":
          return client.type === "Persona Física"
        case "moral":
          return client.type === "Persona Moral"
        case "activos":
          return client.status === "Activo"
        case "inactivos":
          return client.status === "Inactivo"
        case "pendientes":
          return client.status === "Pendiente"
        default:
          return true
      }
    })()

    return matchesSearch && matchesCategory
  })

  const handleClientClick = (client: any) => {
    setSelectedClient(client)
  }

  const handleEditClient = (client: any) => {
    setEditingClient(client)
    setShowClientForm(true)
    setSelectedClient(null)
  }

  const handleClientSubmit = (data: any) => {
    console.log("Client form submitted:", data)
    setShowClientForm(false)
    setEditingClient(null)
  }

  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-64">
          {/* Navigation */}
          <Navigation
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchExpanded={isSearchExpanded}
            setIsSearchExpanded={setIsSearchExpanded}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {/* Category Tabs */}
          <CategoryTabs categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          {/* Clients Grid */}
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} onClick={() => handleClientClick(client)} />
              ))}
            </div>

            {/* Show More Button */}
            <div className="text-center mt-6 sm:mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8">Mostrar todo</Button>
            </div>
          </div>
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <ClientDetail client={selectedClient} onClose={() => setSelectedClient(null)} onEdit={handleEditClient} />
        )}

        {/* Client Form Modal */}
        {showClientForm && (
          <ClientForm
            onClose={() => {
              setShowClientForm(false)
              setEditingClient(null)
            }}
            onSubmit={handleClientSubmit}
            initialData={editingClient}
          />
        )}
      </div>
    </FormProvider>
  )
}
