"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface FormContextType {
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Prevent body scrolling when form is open
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isFormOpen])

  return <FormContext.Provider value={{ isFormOpen, setIsFormOpen }}>{children}</FormContext.Provider>
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}
