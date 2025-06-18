"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Download, Eye } from "lucide-react"

interface OtrosItem {
  id: string
  title: string
  dateAdded: string
  type: string
  description: string
  author?: string
  tags?: string[]
}

interface OtrosCardProps {
  item: OtrosItem
  onClick?: () => void
}

export default function OtrosCard({ item, onClick }: OtrosCardProps) {
  // Function to get type badge color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "formato":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "jurisprudencia":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "documento":
        return "bg-green-100 text-green-800 border-green-200"
      case "plantilla":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "tesis":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "criterio":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "manual":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-all duration-300 border-gray-200 hover:border-blue-200 cursor-pointer h-fit"
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-2 sm:p-3 border-b border-gray-100">
        <div className="text-center">
          <div className="text-base sm:text-lg font-bold text-blue-800">Documento</div>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div>
            <div className="text-xs text-gray-500 mb-1">Título del Documento</div>
            <div className="font-medium text-gray-900 line-clamp-2 flex items-center gap-2">
              <FileText className="h-3 w-3 text-gray-400" />
              {item.title}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Fecha que se agregó</div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 flex-shrink-0" />
              <div className="text-gray-600 text-xs sm:text-sm">{new Date(item.dateAdded).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">Tipo</div>
              <Badge className={`font-normal text-xs ${getTypeColor(item.type)}`}>{item.type}</Badge>
            </div>
          </div>

          {item.author && (
            <div className="pt-1">
              <div className="text-xs text-gray-500 mb-1">Autor</div>
              <div className="text-gray-700 line-clamp-1">{item.author}</div>
            </div>
          )}

          <div className="pt-1">
            <div className="text-xs text-gray-500 mb-1">Descripción</div>
            <div className="text-gray-700 line-clamp-2">{item.description}</div>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Etiquetas</div>
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 h-7 sm:h-8 text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Ver Detalles
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 h-7 sm:h-8 px-2"
              onClick={(e) => {
                e.stopPropagation()
                // Handle download action
              }}
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
