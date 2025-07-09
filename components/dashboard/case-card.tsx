"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface CaseFile {
  id: string
  title: string
  date: string
  clientId: string
  place: string
  subject: string
  court: string
}

interface CaseCardProps {
  caseFile: CaseFile
  onClick?: () => void
}

export default function CaseCard({ caseFile, onClick }: CaseCardProps) {
  // Function to get subject badge color
  const getSubjectColor = (subject: string) => {
    switch (subject) {
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
          <div className="text-base sm:text-lg font-bold text-blue-800">{caseFile.title}</div>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div>
            <div className="text-xs text-gray-500 mb-1">ID del Expediente</div>
            <div className="font-medium text-gray-900 line-clamp-2">{caseFile.id}</div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 flex-shrink-0" />
            <div className="text-gray-600 text-xs sm:text-sm">{new Date(caseFile.date).toLocaleDateString()}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Cliente asociado</div>
            <div className="font-medium text-gray-900 line-clamp-1">{caseFile.clientId}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Estado</div>
            <div className="font-medium text-gray-900 line-clamp-1">{caseFile.place}</div>
          </div>

          <div className="pt-1">
            <div className="text-xs text-gray-500 mb-1">Materia</div>
            <Badge className={`font-normal text-xs ${getSubjectColor(caseFile.subject)}`}>{caseFile.subject}</Badge>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Juzgado</div>
            <div className="text-gray-700 line-clamp-1">{caseFile.court}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
