"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebar"
import Navigation from "./navigation"
import CategoryTabs from "./category-tabs"
import OtrosCard from "./otros-card"
import OtrosDetail from "../details/otros-detail"
import { FormProvider } from "../forms/form-provider"
import OtrosForm from "../forms/otros-form"

// Sample data for otros items
const otrosItems = [
  {
    id: "DOC-001",
    title: "Formato de Demanda Civil",
    dateAdded: "2023-11-15",
    type: "Formato",
    description: "Plantilla estándar para demandas civiles con todos los elementos requeridos por el código procesal.",
    category: "Formatos",
    size: "245 KB",
    format: "DOCX",
    author: "Israel Calva",
    version: "1.2",
    tags: ["Civil", "Demanda", "Plantilla"],
    downloads: 45,
    lastUpdated: "2023-10-20",
  },
  {
    id: "DOC-002",
    title: "Jurisprudencia Laboral 2023",
    dateAdded: "2023-11-10",
    type: "Jurisprudencia",
    description: "Compilación de criterios jurisprudenciales en materia laboral emitidos durante 2023.",
    category: "Jurisprudencias",
    size: "1.2 MB",
    format: "PDF",
  },
  {
    id: "DOC-003",
    title: "Contrato de Prestación de Servicios",
    dateAdded: "2023-11-08",
    type: "Plantilla",
    description: "Modelo de contrato para servicios profesionales con cláusulas de protección.",
    category: "Formatos",
    size: "180 KB",
    format: "DOCX",
  },
  {
    id: "DOC-004",
    title: "Criterios SCJN Derecho Familiar",
    dateAdded: "2023-11-05",
    type: "Jurisprudencia",
    description: "Últimos criterios de la Suprema Corte en materia de derecho familiar y custodia.",
    category: "Jurisprudencias",
    size: "890 KB",
    format: "PDF",
  },
  {
    id: "DOC-005",
    title: "Formato de Amparo Directo",
    dateAdded: "2023-11-03",
    type: "Formato",
    description: "Plantilla para la presentación de demandas de amparo directo ante tribunales colegiados.",
    category: "Formatos",
    size: "320 KB",
    format: "DOCX",
  },
  {
    id: "DOC-006",
    title: "Manual de Procedimientos Internos",
    dateAdded: "2023-11-01",
    type: "Documento",
    description: "Guía de procedimientos internos del despacho para el manejo de expedientes.",
    category: "Todo",
    size: "2.1 MB",
    format: "PDF",
  },
  {
    id: "DOC-007",
    title: "Tesis Aislada Derecho Penal",
    dateAdded: "2023-10-28",
    type: "Jurisprudencia",
    description: "Tesis aislada sobre procedimientos penales y garantías del debido proceso.",
    category: "Jurisprudencias",
    size: "450 KB",
    format: "PDF",
  },
  {
    id: "DOC-008",
    title: "Formato de Poder Notarial",
    dateAdded: "2023-10-25",
    type: "Formato",
    description: "Plantilla para otorgamiento de poderes notariales con diferentes alcances.",
    category: "Formatos",
    size: "195 KB",
    format: "DOCX",
  },
]

const categories = [
  { id: "todo", label: "Todo", active: true },
  { id: "formatos", label: "Formatos" },
  { id: "jurisprudencias", label: "Jurisprudencias" },
  { id: "plantillas", label: "Plantillas" },
  { id: "documentos", label: "Documentos" },
]

export default function OtrosDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("todo")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showOtrosForm, setShowOtrosForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Filter items based on search query and category
  const filteredItems = otrosItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.includes(searchQuery)

    const matchesCategory = (() => {
      switch (activeCategory) {
        case "todo":
          return true
        case "formatos":
          return item.type.toLowerCase() === "formato"
        case "jurisprudencias":
          return item.type.toLowerCase() === "jurisprudencia"
        case "plantillas":
          return item.type.toLowerCase() === "plantilla"
        case "documentos":
          return item.type.toLowerCase() === "documento"
        default:
          return true
      }
    })()

    return matchesSearch && matchesCategory
  })

  const handleItemClick = (item: any) => {
    setSelectedItem(item)
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setShowOtrosForm(true)
    setSelectedItem(null)
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
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredItems.map((item) => (
                <OtrosCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>

            {/* Show More Button */}
            <div className="text-center mt-6 sm:mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8">Mostrar todo</Button>
            </div>
          </div>
        </div>

        {/* Otros Detail Modal */}
        {selectedItem && (
          <OtrosDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onEdit={() => handleEditItem(selectedItem)}
          />
        )}
        {/* Otros Form Modal */}
        {showOtrosForm && (
          <OtrosForm
            onClose={() => {
              setShowOtrosForm(false)
              setEditingItem(null)
            }}
            onSubmit={(data) => {
              console.log("Otros form submitted:", data)
              setShowOtrosForm(false)
              setEditingItem(null)
            }}
            initialData={editingItem}
          />
        )}
      </div>
    </FormProvider>
  )
}
