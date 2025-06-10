"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, Plus, X } from "lucide-react"
import Sidebar from "./sidebar"
import CaseFileForm from "../forms/case-file-form"
import ClientForm from "../forms/client-form"
import OtrosForm from "../forms/otros-form"

interface NavigationProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchExpanded: boolean
  setIsSearchExpanded: (expanded: boolean) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

export default function Navigation({
  searchQuery,
  setSearchQuery,
  isSearchExpanded,
  setIsSearchExpanded,
  isSidebarOpen,
  setIsSidebarOpen,
}: NavigationProps) {
  const searchRef = useRef<HTMLDivElement>(null)
  const [showCaseFileForm, setShowCaseFileForm] = useState(false)
  const [showClientForm, setShowClientForm] = useState(false)
  const [showOtrosForm, setShowOtrosForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Handle click outside search on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsSearchExpanded])

  const handleCaseFileSubmit = (data: any) => {
    console.log("Case file form submitted:", data)
    setShowCaseFileForm(false)
    setEditingItem(null)
  }

  const handleClientSubmit = (data: any) => {
    console.log("Client form submitted:", data)
    setShowClientForm(false)
    setEditingItem(null)
  }

  const handleOtrosSubmit = (data: any) => {
    console.log("Otros form submitted:", data)
    setShowOtrosForm(false)
    setEditingItem(null)
  }

  return (
    <>
      <div className="sticky top-0 z-10 w-full">
        {/* Mobile Header */}
        <div className="md:hidden bg-blue-900 text-white p-4">
          <div className="flex items-center justify-between">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800 h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <Sidebar isMobile={true} />
              </SheetContent>
            </Sheet>

            <div className="font-semibold text-base">Sistema Legal</div>

            <div className="flex items-center gap-2">
              {isSearchExpanded ? (
                <div ref={searchRef} className="absolute inset-x-0 top-0 bg-blue-900 p-4 flex items-center gap-2 z-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white h-10 w-10"
                    onClick={() => setIsSearchExpanded(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Buscar..."
                    className="flex-1 bg-blue-800 border-blue-700 text-white placeholder-blue-300 h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-blue-800 h-10 w-10"
                    onClick={() => setIsSearchExpanded(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-blue-800 h-10 w-10"
                    onClick={() => setShowCaseFileForm(true)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-gradient-to-r from-blue-800 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between max-w-full">
            <h1 className="text-xl font-semibold">Búsqueda</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                <Input
                  placeholder="Ingrese un termino..."
                  className="pl-10 bg-blue-700 border-blue-600 text-white placeholder-blue-300 w-48 lg:w-64 focus:w-64 lg:focus:w-80 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-none text-white whitespace-nowrap"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-none text-white whitespace-nowrap"
                  onClick={() => setShowCaseFileForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Exp
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-none text-white whitespace-nowrap"
                  onClick={() => setShowClientForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Cliente
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-none text-white whitespace-nowrap"
                  onClick={() => setShowOtrosForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Otro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showCaseFileForm && (
        <CaseFileForm
          onClose={() => {
            setShowCaseFileForm(false)
            setEditingItem(null)
          }}
          onSubmit={handleCaseFileSubmit}
          initialData={editingItem}
        />
      )}
      {showClientForm && (
        <ClientForm
          onClose={() => {
            setShowClientForm(false)
            setEditingItem(null)
          }}
          onSubmit={handleClientSubmit}
          initialData={editingItem}
        />
      )}
      {showOtrosForm && (
        <OtrosForm
          onClose={() => {
            setShowOtrosForm(false)
            setEditingItem(null)
          }}
          onSubmit={handleOtrosSubmit}
          initialData={editingItem}
        />
      )}
    </>
  )
}
