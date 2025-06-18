"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation" // Comentado para evitar el error de compilación
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("") // Estado para el email
  const [password, setPassword] = useState("") // Estado para la contraseña
  const [errorMessage, setErrorMessage] = useState("") // Estado para mensajes de error
  const router = useRouter() // Si estás usando Next.js en tu proyecto local, puedes descomentar esto.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("") // Limpiar cualquier mensaje de error previo

    try {
      const response = await fetch("http://localhost:8000/login", { // Ajusta la URL de tu API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Login exitoso
        console.log("Inicio de sesión exitoso:", data.user)
        // alert("Inicio de sesión exitoso. Redirigiendo al dashboard (simulado).") // Para demostración si no usas Next.js router
        // Si estás en un entorno Next.js real, puedes descomentar y usar router.push("/dashboard")
        router.push("/dashboard")
      } else {
        // Error de login (credenciales inválidas, etc.)
        setErrorMessage(data.error || "Error al iniciar sesión. Inténtalo de nuevo.")
      }
    } catch (error) {
      console.error("Error en la solicitud de login:", error)
      setErrorMessage("No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/background.jpg"
          alt="Imagen de fondo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Sistema Legal Profesional</h2>
          <p className="text-lg opacity-90">Gestiona tus expedientes y clientes de manera eficiente.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:w-1/2 bg-gray-50/50">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-none lg:border lg:shadow-lg lg:bg-white">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-3xl font-bold tracking-tight">Bienvenido</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu correo"
                    required
                    className="h-11"
                    disabled={isLoading}
                    value={email} // <-- AGREGADO
                    onChange={(e) => setEmail(e.target.value)} // <-- AGREGADO
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Contraseña
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      required
                      className="h-11 pr-10"
                      disabled={isLoading}
                      value={password} // <-- AGREGADO
                      onChange={(e) => setPassword(e.target.value)} // <-- AGREGADO
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Recordarme por 30 días
                  </Label>
                </div>

                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                )}

                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Notas</span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground py-2 px-4 border rounded bg-gray-100">
                El registro de usuarios está gestionado por el administrador. Si necesitas acceso, por favor contacta al despacho.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
