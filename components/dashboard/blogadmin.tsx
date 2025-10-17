"use client";

import { useState, useEffect, useCallback } from "react";
// Asumo que estos componentes existen en tu proyecto
import Sidebar from "./sidebar";
import { FormProvider } from "../forms/form-provider";

// Importaciones de Shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plus,
  X,
  Check,
  XCircle,
  Pencil,
  Eye,
  Trash2,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

// URL de tu Backend
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://abogados-app-backend2.up.railway.app";

// ==========================================================
// COMPONENTES DE PRESENTACIÓN
// ==========================================================

// Componente revisado para una mejor tarjeta de contenido
// Componente revisado para una mejor tarjeta de contenido
function ContentCard({ item, section, onClick, onEdit, onToggle, onDelete }: any) {
  const isNews = section === "news";
  
  // Función para evitar que el clic de la tarjeta se active al hacer clic en un botón
  const handleActionClick = (e: React.MouseEvent, action: Function, arg: any) => {
    e.stopPropagation();
    action(arg);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 border-2 border-gray-100/80 hover:border-[#1D4E89]/40">
      {item.image && (
        <div className="relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <Badge
            className={`absolute top-2 left-2 text-xs font-semibold ${
              item.activo ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {item.activo ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      )}
      <CardHeader className="flex-grow pb-2">
        <CardTitle className="text-[#1D4E89] text-xl line-clamp-2">
          {item.title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Calendar className="h-4 w-4 text-[#1D4E89]" />
            {item.dateAdded || item.date}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <CardDescription className="text-gray-700 line-clamp-3 mb-3">
          {isNews ? item.preview : item.content}
        </CardDescription>
        
        {!isNews && (
            <p className="text-sm text-gray-500 font-medium">Autor: {item.author || "Anónimo"}</p>
        )}
      </CardContent>
      {/* 🚩 CORRECCIÓN 1: Sustituimos DialogFooter y arreglamos el diseño de botones */}
      {/* Usamos un div simple con flex-col para forzar el apilamiento si el espacio es muy pequeño, pero el justify-end para alinearlos a la derecha */}
      <div className="flex flex-wrap justify-end gap-2 p-4 pt-0">
        
        {/* Botón de Editar */}
        <Button
            size="sm"
            variant="outline"
            onClick={(e) => handleActionClick(e, onEdit, item)}
            title="Editar Contenido"
        >
            <Pencil className="h-4 w-4" />
        </Button>
        
        {/* Botón de Ver (Solo para Discusiones) */}
        {!isNews && ( // 🚩 CORRECCIÓN 3: Ocultamos el botón "Ver" para Noticias
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleActionClick(e, onClick, item)}
              title={`Ver y moderar comentarios (${item.comments?.length || 0})`}
            >
              <Eye className="h-4 w-4 mr-1" />
              {item.comments?.length || 0}
            </Button>
        )}
        
        {/* Botón de Estatus (Activar/Desactivar) */}
        <Button
            size="sm"
            variant={item.activo ? "destructive" : "default"}
            onClick={(e) => handleActionClick(e, onToggle, item)}
            title={item.activo ? "Desactivar Contenido" : "Activar Contenido"}
        >
            {item.activo ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
        </Button>
        
        {/* 🚩 CORRECCIÓN 2: El botón de Borrado Lógico (basura) ha sido ELIMINADO */}
      </div>
    </Card>
  );
}

// Componente para la vista de detalle (AHORA CON MANEJO DE COMENTARIOS)
function ContentDetail({ item, section, onClose, onCommentToggle }: any) {
  if (!item) return null;
  const isNews = section === "news";
  const contentText = isNews ? item.fullContent || item.preview : item.content;
  const dateText = isNews ? item.dateAdded : item.date;
  
  // Normalizar la estructura de comentarios si es necesario
  const comments = item.comments?.map((c: any) => ({
    ...c,
    text: c.text || c.content, // Normalizamos el campo de texto del comentario
    activo: c.activo === undefined ? true : c.activo, // Aseguramos un estado 'activo' por defecto
  }));

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-xl shadow-2xl">
        {/* ... (Header y Contenido de la Noticia/Discusión se mantiene igual) ... */}
        <div className="relative">
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-72 object-cover rounded-t-xl"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-3xl font-bold text-[#1D4E89]">
              {item.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b pb-4">
            {dateText && (
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{dateText}</span>
                </div>
            )}
            {!isNews && (
                <p className="font-medium text-gray-700">Autor: {item.author || "Anónimo"}</p>
            )}
            <Badge
                className={`text-xs font-semibold ${
                  item.activo ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {item.activo ? "Publicado" : "Borrador"}
            </Badge>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {contentText}
          </p>

          {/* Bloque de Comentarios MEJORADO */}
          {comments && comments.length > 0 && (
            <div className="mt-10 border-t pt-6">
              <h3 className="font-semibold text-2xl text-[#1D4E89] mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6" /> Moderación de Comentarios ({comments.length})
              </h3>
              <div className="space-y-4">
                {comments.map((c: any, i: number) => (
                  <div
                    key={c.id || i}
                    className={`border-l-4 p-4 rounded-r-md transition-colors ${
                        c.activo ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-gray-800">
                                {c.author || "Anónimo"}
                                <span className="text-xs font-normal ml-3 text-gray-500">{c.date}</span>
                            </p>
                            <Badge
                                variant="outline"
                                className={`mt-1 text-xs ${c.activo ? "text-green-700 border-green-700/50" : "text-red-700 border-red-700/50"}`}
                            >
                                {c.activo ? "APROBADO" : "PENDIENTE/INACTIVO"}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="icon"
                                variant={c.activo ? "outline" : "default"}
                                className={c.activo ? "text-red-500 border-red-500 hover:bg-red-100" : "bg-green-600 hover:bg-green-700"}
                                onClick={() => onCommentToggle(item, c)}
                                title={c.activo ? "Desactivar Comentario" : "Aprobar Comentario"}
                            >
                                {c.activo ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <p className="text-gray-700 mt-2">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componente para el formulario de Creación/Edición (Sin cambios)
function ContentForm({ onClose, onSubmit, initialData, section }: any) {
  const isEditing = !!initialData;
  const isNews = section === "news";
  
  // Establecer el estado inicial con los campos adecuados
  const initialFormState = isNews 
    ? { title: "", preview: "", fullContent: "", image: "", ...initialData }
    : { title: "", content: "", author: "", ...initialData };

  const [form, setForm] = useState(initialFormState);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1D4E89]">
            {isEditing ? `Editar ${isNews ? "Noticia" : "Discusión"}` : `Nueva ${isNews ? "Noticia" : "Discusión"}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
          />
          
          {/* Campos específicos para Noticias */}
          {isNews ? (
            <>
              <Textarea
                name="preview"
                placeholder="Vista previa (Resumen corto)"
                value={form.preview}
                onChange={handleChange}
                required
              />
              <Textarea
                name="fullContent"
                placeholder="Contenido completo (Markdown/HTML opcional)"
                value={form.fullContent}
                onChange={handleChange}
                rows={8}
                required
              />
              <Input
                name="image"
                placeholder="URL de imagen (opcional)"
                value={form.image}
                onChange={handleChange}
              />
            </>
          ) : (
            // Campos específicos para Discusiones
            <>
              <Input
                name="author"
                placeholder="Autor (o tu nombre de Admin)"
                value={form.author}
                onChange={handleChange}
                required
              />
              <Textarea
                name="content"
                placeholder="Contenido de la Discusión"
                value={form.content}
                onChange={handleChange}
                rows={8}
                required
              />
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!form.title || (isNews && !form.preview) || (!isNews && !form.content)}>Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================================
// DASHBOARD PRINCIPAL
// ==========================================================

export default function BlogDashboard() {
  const [section, setSection] = useState<"news" | "discussions">("news");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<any>(null);

  // Endpoint para listar (siempre plural)
  const listEndpoint = section === "news" ? "blogs" : "discussions";
  // Endpoint para interactuar con un ítem (siempre singular)
  const itemEndpoint = section === "news" ? "blog" : "discussion";

  // Función de carga de datos optimizada (con useCallback para dependencia en useEffect)
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Usamos el endpoint PLURAL para LISTAR (Este endpoint debería traer TODO, activo e inactivo)
      const res = await fetch(`${BACKEND_URL}/${listEndpoint}`);
      if (!res.ok) {
        throw new Error(`Error al cargar: ${res.statusText}`);
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError("Error al cargar contenido. Verifica la conexión o el backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [listEndpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Manejo de alternancia de estado (Activo/Inactivo)
  const handleToggle = async (item: any) => {
    try {
      const nextActivo = !item.activo;
      let bodyToSend: any = {};

      if (section === 'news') {
        // CORRECCIÓN para Noticias:
        // El backend de blog requiere explícitamente title, preview y fullContent.
        // Aseguramos que se envíen todos los campos existentes en el ítem.
        bodyToSend = { 
            title: item.title, 
            preview: item.preview, 
            fullContent: item.fullContent,
            image: item.image, // Es opcional, pero mejor enviarlo
            dateAdded: item.dateAdded, // Es opcional, pero mejor enviarlo
            activo: nextActivo, 
            _method: "PUT" 
        };
      } else { // Discussions
        // Para discusiones, enviamos los campos de discusión
        bodyToSend = { 
            title: item.title, 
            content: item.content, 
            author: item.author, 
            activo: nextActivo, 
            _method: "PUT" 
        };
      }

      const url = `${BACKEND_URL}/${itemEndpoint}/${item.id}`;
      
      const res = await fetch(url, {
        method: "POST", // Usamos POST para el _method=PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error ${res.status} al cambiar estado.`);
      }

      fetchItems();
    } catch (e: any) {
      alert(`Error al cambiar estado: ${e.message}.`);
      console.error(e);
    }
  };
  
  // Función de Borrado Lógico (Se mantiene igual)
  const handleDelete = async (item: any) => {
    try {
      // Se utiliza la ruta DELETE y el endpoint SINGULAR
      const res = await fetch(`${BACKEND_URL}/${itemEndpoint}/${item.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Fallo la eliminación lógica");
      }
      
      setShowDeleteConfirmation(null); // Cerrar modal
      fetchItems();
    } catch {
      alert("Error al borrar el contenido.");
    }
  };

  // 🆕 Función para alternar el estado de un comentario específico
  const handleCommentToggle = async (post: any, comment: any) => {
      try {
          // 1. Clonar y actualizar el comentario
          const updatedComments = (post.comments || []).map((c: any) => {
              // Comparamos por ID. Si no tiene ID (Firebase a veces usa claves numéricas/automáticas), podríamos usar createdAt si existiera
              const isMatch = c.id === comment.id;
              
              if (isMatch) {
                  // IMPORTANTE: Los comentarios en Firebase se guardan con el campo 'content' y no 'text'
                  return { 
                      ...c, 
                      activo: !comment.activo,
                      // Aseguramos que los campos se envíen con sus nombres originales de Firebase
                      author: c.author || comment.author, 
                      content: c.content || comment.text,
                  };
              }
              
              return c;
          });

          // 2. Preparar los datos para enviar la actualización del post completo (Discusión o Blog)
          const nextActivo = post.activo ?? true; 
          let bodyToSend: any = { _method: "PUT" };

          if (section === 'news') { 
             // CORRECCIÓN para Noticias/Blogs:
             // Al igual que en handleToggle, enviamos todos los campos requeridos
             bodyToSend = { 
                ...bodyToSend,
                title: post.title,
                preview: post.preview,
                fullContent: post.fullContent,
                image: post.image,
                dateAdded: post.dateAdded,
                activo: nextActivo,
                // El backend de noticias no maneja un subnodo de comentarios
                // Si la lógica de comentarios aplica a noticias, el backend debe ajustarse
                // Asumiendo que SÓLO Discusiones tienen comentarios:
                // Si llegaste aquí, hay un error de lógica, pero por seguridad no enviamos 'comments'
             };

          } else { // Discussions (CORREGIDO)
            // CORRECCIÓN para Discusiones:
            // Aseguramos de enviar sólo los campos que el endpoint POST /discussion/{id} con _method=PUT espera:
            bodyToSend = { 
                ...bodyToSend,
                title: post.title, 
                content: post.content, 
                author: post.author, 
                activo: nextActivo,
                // Agregamos el arreglo de comentarios actualizado
                comments: updatedComments
            };
          }
          
          // IMPORTANTE: El backend de Discusiones no espera el campo 'comments' si NO se está actualizando la discusión
          // Pero para actualizar un comentario, debemos enviar el post completo incluyendo 'comments'

          const url = `${BACKEND_URL}/${itemEndpoint}/${post.id}`;
          
          const res = await fetch(url, {
            method: "POST", // Usamos POST para el _method=PUT
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyToSend),
          });

          if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || `Error ${res.status} al moderar el comentario.`);
          }
          
          // Actualizar la vista de detalle para que se vea el cambio inmediatamente
          setSelectedItem((prev: any) => ({ ...prev, comments: updatedComments }));
          
          // Recargar la lista completa después de la actualización exitosa
          fetchItems(); 

      } catch (e: any) {
          alert(`Error al moderar comentario: ${e.message}`);
          console.error(e);
      }
  };

  // Manejo del formulario (Crear/Editar) (Se mantiene igual)
  const handleSubmit = async (formData: any) => {
    try {
      let requestData: any = {};
      
      // 1. Mapear campos dependiendo de la sección (Asegurando que la data se envíe correctamente)
      if (section === 'discussions') {
          requestData = {
              title: formData.title,
              content: formData.content, 
              author: formData.author,
          };
      } else { // News (Noticias/Blogs)
          requestData = {
              title: formData.title,
              preview: formData.preview,
              fullContent: formData.fullContent,
              image: formData.image,
          };
      }
      
      // 2. Definir método y URL
      const method = "POST";
      const url = editingItem
        ? `${BACKEND_URL}/${itemEndpoint}/${editingItem.id}` 
        : `${BACKEND_URL}/${itemEndpoint}`; 
        
      // 3. Agregar el método PUT al cuerpo si es una EDICIÓN (y los comentarios si existen)
      const bodyData = editingItem 
        ? { 
            ...requestData, 
            activo: editingItem.activo ?? true, 
            comments: editingItem.comments ?? [], // Mantenemos los comentarios al editar
            _method: "PUT" 
          } 
        : requestData;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error ${res.status} al guardar.`);
      }
      
      setShowForm(false);
      setEditingItem(null);
      fetchItems();
    } catch (e: any) {
      alert(`Error al guardar: ${e.message}`);
      console.error(e);
    }
  };
  
  // Manejo de la apertura del formulario de edición
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  }
  
  // Manejo del cierre del formulario
  const handleCloseForm = () => {
      setShowForm(false);
      setEditingItem(null);
  }

  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-64">

          {/* Selector y Botón Nuevo */}
          <div className="flex items-center justify-between p-6 border-b bg-white shadow-sm sticky top-0 z-10">
            <div className="flex gap-3">
              <Button
                variant={section === "news" ? "default" : "outline"}
                onClick={() => setSection("news")}
              >
                Noticias (Blogs)
              </Button>
              <Button
                variant={section === "discussions" ? "default" : "outline"}
                onClick={() => setSection("discussions")}
              >
                Discusiones
              </Button>
            </div>

            <Button
              onClick={() => { setShowForm(true); setEditingItem(null); }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Nueva {section === "news" ? "Noticia" : "Discusión"}
            </Button>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-6">
            {loading && (
              <p className="text-center text-gray-600 text-lg py-10">Cargando contenido...</p>
            )}
            {error && <p className="text-center text-xl text-red-500 py-10">{error}</p>}
            
            {!loading && !error && items.length === 0 && (
                <div className="text-center py-20 bg-white rounded-lg shadow-inner">
                    <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No hay {section === "news" ? "noticias" : "discusiones"} disponibles. Crea una nueva para empezar.</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  section={section}
                  onClick={() => setSelectedItem(item)}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                  onDelete={setShowDeleteConfirmation}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modales */}
        {selectedItem && (
          <ContentDetail
            item={selectedItem}
            section={section}
            onClose={() => setSelectedItem(null)}
            onCommentToggle={handleCommentToggle} // 🆕 Pasamos la función de toggle de comentarios
          />
        )}
        
        {showForm && (
          <ContentForm
            onClose={handleCloseForm}
            onSubmit={handleSubmit}
            initialData={editingItem}
            section={section}
          />
        )}
        
        {/* Modal de Confirmación de Borrado */}
        {showDeleteConfirmation && (
            <Dialog open={!!showDeleteConfirmation} onOpenChange={() => setShowDeleteConfirmation(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl text-red-600 flex items-center gap-2">
                            <Trash2 className="h-6 w-6" /> Confirmar Borrado Lógico
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700">
                        ¿Estás seguro de que deseas **desactivar** ("borrar lógicamente") la {section === "news" ? "noticia" : "discusión"} **"{showDeleteConfirmation.title}"**? 
                        No se eliminará permanentemente, solo se marcará como inactiva.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirmation(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={() => handleDelete(showDeleteConfirmation)}>
                            Sí, Desactivar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
      </div>
    </FormProvider>
  );
}