"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation" // Comentado para evitar el error de compilación
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("") // Estado para el email
  const [name, setName] = useState("") // Nuevo estado para el nombre del usuario
  const [role, setRole] = useState("") // Nuevo estado para el rol
  const [phone, setPhone] = useState("") // Nuevo estado para el teléfono
  const [password, setPassword] = useState("") // Estado para la contraseña
  const [errorMessage, setErrorMessage] = useState("") // Estado para mensajes de error
  const [successMessage, setSuccessMessage] = useState("") // Nuevo estado para mensajes de éxito
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter() // Si estás usando Next.js en tu proyecto local, puedes descomentar esto.

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
        localStorage.setItem('loggedInUser', JSON.stringify(data.user)); 
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch("http://localhost:8000/usuario", { // Endpoint para registrar usuarios
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, phone }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Registro exitoso:", data.usuario)
        setSuccessMessage("¡Registro exitoso! Tu cuenta ha sido creada y está pendiente de activación por un administrador.");
        setEmail("");
        setPassword("");
        setName("");
        setRole("");
        setPhone("");
        setIsRegistering(false); // Volver a la vista de login
      } else {
        setErrorMessage(data.error || "Error al registrar usuario. Inténtalo de nuevo.")
      }
    } catch (error) {
      console.error("Error en la solicitud de registro:", error)
      setErrorMessage("No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <img
          src="/images/background.jpg"
          alt="Imagen de fondo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="absolute inset-0 bg-black/10" />

        {/* Logo Container */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8 ">
          <img
            src="/images/logo.png"
            alt="Logo de la empresa"
            className="w-80 h-80 object-contain mb-4 rounded-full "
          />
        </div>

        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Calva Corro Abogados</h2>
          <p className="text-lg opacity-90">NADA POR LA FUERZA TODO POR LA RAZÓN Y EL DERECHO</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:w-1/2 bg-blue-50/90">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-none lg:border lg:shadow-lg lg:bg-white">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-3xl font-bold tracking-tight">
                {isRegistering ? "Crear Cuenta" : "Bienvenido"}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                {isRegistering
                  ? "Ingresa tus datos para registrarte"
                  : "Ingresa tus credenciales para acceder al sistema"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                {isRegistering && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        className="h-11"
                        disabled={isLoading}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select value={role} onValueChange={setRole} disabled={isLoading}>
                        <SelectTrigger id="role" className="w-full h-11">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="abogado">Abogado</SelectItem>
                          <SelectItem value="asistente">Asistente</SelectItem>
                          <SelectItem value="Colaborador">Colaborador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Ej. +52 55 1234 5678"
                        className="h-11"
                        disabled={isLoading}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </>
                )}

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

                {/* <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Recordarme por 30 días
                  </Label>
                </div> */}

                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isRegistering ? "Registrando..." : "Iniciando sesión..."}
                    </>
                  ) : (
                    isRegistering ? "Registrarse" : "Iniciar Sesión"
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

              <Button
                variant="outline"
                className="w-full h-11 text-base font-medium"
                onClick={() => setIsRegistering(!isRegistering)}
                disabled={isLoading}
              >
                {isRegistering ? "Iniciar Sesión" : "Registrarse"}
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
