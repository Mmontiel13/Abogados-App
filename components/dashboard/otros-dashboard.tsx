"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebar"
import Navigation from "./navigation"
import CategoryTabs from "./category-tabs"
import OtrosCard from "./otros-card"
import OtrosDetail from "../details/otros-detail"
import { FormProvider } from "../forms/form-provider"
import OtrosForm from "../forms/otros-form"

export default function OtrosDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("todo")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showOtrosForm, setShowOtrosForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [otrosItems, setOtrosItems] = useState<any[]>([])
  const [loadingOtros, setLoadingOtros] = useState(true)
  const [errorOtros, setErrorOtros] = useState<string | null>(null)

  const categories = [
    { id: "formato", label: "Formatos", active: true }, // Cambiado a 'formato' para coincidir con el backend
    { id: "jurisprudencia", label: "Jurisprudencias" }, // Cambiado a 'jurisprudencia'
    { id: "plantilla", label: "Plantillas" }, // Cambiado a 'plantilla'
    { id: "documento", label: "Documentos" }, // Cambiado a 'documento'
    { id: "tesis", label: "Tesis" },
    { id: "criterio", label: "Criterios" },
    { id: "manual", label: "Manuales" },
  ]
  // Función para cargar los elementos "Otros" desde el backend
  const fetchOtrosItems = async () => {
    setLoadingOtros(true)
    setErrorOtros(null)
    try {
      const response = await fetch("http://localhost:8000/others") // Tu endpoint para listar "Otros"
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Otros items recibidos del backend:", data)
      setOtrosItems(data) // Actualiza el estado con los datos reales de la API
    } catch (error: any) {
      console.error("Error al cargar otros items:", error)
      setErrorOtros(`Error al cargar los archivos: ${error.message}.`)
    } finally {
      setLoadingOtros(false)
    }
  }

  // Cargar items al montar el componente
  useEffect(() => {
    fetchOtrosItems()
  }, []) // Se ejecuta solo una vez al montar

  // Filter items based on search query and category
  const filteredItems = otrosItems.filter((item) => {
    const matchesSearch =
      (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const otherType = item.type?.toLowerCase()

    const matchesCategory =
      activeCategory === "todo" || otherType === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory
  })

  const handleItemClick = (item: any) => {
    setSelectedItem(item)
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setShowOtrosForm(true)
    setSelectedItem(null) // Cierra el detalle si estaba abierto
  }

  // Callback para cuando el formulario de "Otro" se envía con éxito (creación o edición)
  const handleOtrosFormSuccess = () => {
    setShowOtrosForm(false) // Cierra el modal del formulario
    setEditingItem(null) // Limpia el item en edición
    setSelectedItem(null); // Asegúrate de cerrar cualquier detalle abierto
    fetchOtrosItems(); // Vuelve a cargar los items para actualizar el grid
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

          {/* Items Grid */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredItems.map((item) => (
                <OtrosCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          </div>
        </div>

        {/* Otros Detail Modal */}
        {selectedItem && (
          <OtrosDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onEdit={handleEditItem}
          />
        )}
        {/* Otros Form Modal */}
        {showOtrosForm && (
          <OtrosForm
            onClose={() => {
              setShowOtrosForm(false)
              setEditingItem(null)
            }}
            onSubmit={handleOtrosFormSuccess} // Usar el callback de éxito
            initialData={editingItem}
          />
        )}
      </div>
    </FormProvider>
  )
}
