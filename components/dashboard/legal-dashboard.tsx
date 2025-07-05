"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebar"
import Navigation from "./navigation"
import CategoryTabs from "./category-tabs"
import CaseCard from "./case-card"
import CaseFileDetail from "../details/case-file-detail"
import { FormProvider } from "../forms/form-provider"
import CaseFileForm from "../forms/case-file-form"

export default function LegalDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("recientes")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [showCaseFileForm, setShowCaseFileForm] = useState(false)
  const [editingCase, setEditingCase] = useState<any>(null)

  const [caseFiles, setCaseFiles] = useState<any[]>([])
  const [loadingCases, setLoadingCases] = useState(true)
  const [errorCases, setErrorCases] = useState<string | null>(null)

  const categories = [
    { id: "recientes", label: "Expedientes Recientes", active: true },
    { id: "familiar", label: "Familiar" },
    { id: "civil", label: "Civil" },
    { id: "penal", label: "Penal" },
    { id: "laboral", label: "Laboral" },
    { id: "mercantil", label: "Mercantil" },
  ]

  const fetchCaseFiles = async () => {
    setLoadingCases(true)
    setErrorCases(null)
    try {
      const response = await fetch("http://localhost:8000/cases") // Endpoint para obtener todos los expedientes
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // console.log("Datos de expedientes recibidos:", data); // Para depuración
      setCaseFiles(data) // Actualiza el estado con los datos reales
    } catch (error: any) {
      console.error("Error fetching case files:", error)
      setErrorCases(`Error al cargar los expedientes: ${error.message}. Por favor, inténtalo de nuevo más tarde.`)
    } finally {
      setLoadingCases(false)
    }
  }

  // useEffect para cargar los expedientes cuando el componente se monta
  useEffect(() => {
    fetchCaseFiles()
  }, []) // El array vacío asegura que se ejecute solo una vez al montar el componente

  // Filter case files based on search query and category
  const filteredCaseFiles = caseFiles.filter((caseFile) => {
    // Asegurarse de que los campos existan antes de llamar a toLowerCase()
    const matchesSearch =
      (caseFile.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseFile.clientId?.toLowerCase().includes(searchQuery.toLowerCase()) || // Ahora busca por clientId
        caseFile.id?.includes(searchQuery) ||
        caseFile.place?.toLowerCase().includes(searchQuery.toLowerCase())
      )

    // Se asume que el backend podría enviar 'category' o 'subject' (materia)
    // Ajusta según el campo real que tu backend use para la clasificación.
    const caseCategoryOrMatter = caseFile.category?.toLowerCase() || caseFile.subject?.toLowerCase();

    const matchesCategory =
      activeCategory === "recientes" || caseCategoryOrMatter === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory
  })

  const handleCaseClick = (caseFile: any) => {
    setSelectedCase(caseFile)
  }

  const handleEditCase = (caseFile: any) => {
    setEditingCase(caseFile)
    setShowCaseFileForm(true)
    setSelectedCase(null) // Cierra el detalle si estaba abierto
  }

  // Función para recargar los expedientes después de una operación (crear, editar, eliminar)
  const handleFormSuccess = () => {
    setShowCaseFileForm(false)
    setEditingCase(null)
    setSelectedCase(null); // Asegúrate de cerrar cualquier detalle abierto
    fetchCaseFiles(); // Vuelve a cargar los datos para reflejar los cambios
  };

  // Puedes añadir funciones para crear/eliminar si los botones existen en Navigation o CaseFileDetail
  const handleCreateCase = () => {
    setEditingCase(null); // Asegura que es un nuevo formulario
    setShowCaseFileForm(true);
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

          {/* Case Files Grid */}
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredCaseFiles.map((caseFile) => (
                <CaseCard key={caseFile.id} caseFile={caseFile} onClick={() => handleCaseClick(caseFile)} />
              ))}
            </div>

            {/* Show More Button */}
            {/* <div className="text-center mt-6 sm:mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8">Mostrar todo</Button>
            </div> */}
          </div>
        </div>

        {/* Case File Detail Modal */}
        {selectedCase && (
          <CaseFileDetail caseFile={selectedCase} onClose={() => setSelectedCase(null)} onEdit={handleEditCase} />
        )}

        {showCaseFileForm && (
          <CaseFileForm
            onClose={() => {
              setShowCaseFileForm(false)
              setEditingCase(null)
            }}
            onSubmit={handleFormSuccess} // CAMBIO AQUÍ
            initialData={editingCase}
          />
        )}
      </div>
    </FormProvider>
  )
}