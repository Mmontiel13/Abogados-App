"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebar"
import Navigation from "./navigation"
import CategoryTabs from "./category-tabs"
import CaseCard from "./case-card"
import CaseFileDetail from "../details/case-file-detail"
import { FormProvider } from "../forms/form-provider"
import CaseFileForm from "../forms/case-file-form"

// Sample data for case files
const caseFiles = [
  {
    id: "2023/001",
    title: "Divorcio Contencioso",
    date: "2023-11-15",
    client: "María González Pérez",
    status: "En Proceso",
    matter: "Derecho Familiar",
    court: "Juzgado 1° Familiar",
    category: "Familiar",
    description:
      "Proceso de divorcio contencioso iniciado por la Sra. María González contra su cónyuge. Incluye disputa por custodia de menores y división de bienes matrimoniales.",
  },
  {
    id: "2023/002",
    title: "Demanda Laboral",
    date: "2023-11-10",
    client: "Carlos Rodríguez López",
    status: "Abierto",
    matter: "Derecho Laboral",
    court: "Juzgado 2° Laboral",
    category: "Laboral",
  },
  {
    id: "2023/003",
    title: "Contrato Mercantil",
    date: "2023-11-08",
    client: "Ana Martínez Silva",
    status: "Revisión",
    matter: "Derecho Mercantil",
    court: "Juzgado Civil",
    category: "Mercantil",
  },
  {
    id: "2023/004",
    title: "Demanda Civil",
    date: "2023-11-05",
    client: "Juan López García",
    status: "Abierto",
    matter: "Derecho Civil",
    court: "Juzgado 3° Civil",
    category: "Civil",
  },
  {
    id: "2023/005",
    title: "Proceso Penal",
    date: "2023-11-03",
    client: "Laura Sánchez Ruiz",
    status: "En Proceso",
    matter: "Derecho Penal",
    court: "Juzgado Penal",
    category: "Penal",
  },
  {
    id: "2023/006",
    title: "Custodia Menor",
    date: "2023-11-01",
    client: "Roberto Fernández",
    status: "Cerrado",
    matter: "Derecho Familiar",
    court: "Juzgado 2° Familiar",
    category: "Familiar",
  },
  {
    id: "2023/007",
    title: "Despido Injustificado",
    date: "2023-10-28",
    client: "Patricia Díaz Moreno",
    status: "En Proceso",
    matter: "Derecho Laboral",
    court: "Juzgado 1° Laboral",
    category: "Laboral",
  },
  {
    id: "2023/008",
    title: "Constitución Empresa",
    date: "2023-10-25",
    client: "Empresa ABC S.A.",
    status: "Abierto",
    matter: "Derecho Mercantil",
    court: "Registro Mercantil",
    category: "Mercantil",
  },
]

const categories = [
  { id: "recientes", label: "Expedientes Recientes", active: true },
  { id: "familiar", label: "Familiar" },
  { id: "civil", label: "Civil" },
  { id: "penal", label: "Penal" },
  { id: "laboral", label: "Laboral" },
  { id: "mercantil", label: "Mercantil" },
]

export default function LegalDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("recientes")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [showCaseFileForm, setShowCaseFileForm] = useState(false)
  const [editingCase, setEditingCase] = useState<any>(null)

  // Filter case files based on search query and category
  const filteredCaseFiles = caseFiles.filter((caseFile) => {
    const matchesSearch =
      caseFile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseFile.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseFile.id.includes(searchQuery)

    const matchesCategory =
      activeCategory === "recientes" || caseFile.category.toLowerCase() === activeCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const handleCaseClick = (caseFile: any) => {
    setSelectedCase(caseFile)
  }

  const handleEditCase = (caseFile: any) => {
    setEditingCase(caseFile)
    setShowCaseFileForm(true)
    setSelectedCase(null)
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

          {/* Case Files Grid */}
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredCaseFiles.map((caseFile) => (
                <CaseCard key={caseFile.id} caseFile={caseFile} onClick={() => handleCaseClick(caseFile)} />
              ))}
            </div>

            {/* Show More Button */}
            <div className="text-center mt-6 sm:mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8">Mostrar todo</Button>
            </div>
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
            onSubmit={(data) => {
              console.log("Case file form submitted:", data)
              setShowCaseFileForm(false)
              setEditingCase(null)
            }}
            initialData={editingCase}
          />
        )}
      </div>
    </FormProvider>
  )
}
