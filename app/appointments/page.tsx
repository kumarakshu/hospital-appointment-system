"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  X,
  CheckCircle,
  Heart,
  Search,
  Filter,
  MapPin,
  Phone,
} from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: number
  patientName: string
  doctorName: string
  specialization: string
  appointmentDate: string
  appointmentTime: string
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
  appointmentType: string
  location: string
  symptoms?: string
  notes?: string
  createdAt: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "SCHEDULED" | "COMPLETED" | "CANCELLED">("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Load appointments from localStorage
      const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")

      // If no appointments in localStorage, use default mock data
      const mockAppointments: Appointment[] =
        storedAppointments.length > 0
          ? storedAppointments
          : [
              {
                id: 1,
                patientName: "Akash Kumar",
                doctorName: "Dr. Sunita Gupta",
                specialization: "Cardiology",
                appointmentDate: "2024-08-15",
                appointmentTime: "10:00",
                status: "SCHEDULED",
                appointmentType: "consultation",
                location: "Downtown Medical Center",
                symptoms: "Chest pain and shortness of breath",
                notes: "Patient reports symptoms for the past week",
                createdAt: "2024-08-10",
              },
              {
                id: 2,
                patientName: "Sandeep Mehta",
                doctorName: "Dr. Vikram Singh",
                specialization: "Neurology",
                appointmentDate: "2024-08-12",
                appointmentTime: "14:30",
                status: "COMPLETED",
                appointmentType: "followup",
                location: "Central Hospital",
                symptoms: "Follow-up for migraine treatment",
                createdAt: "2024-08-08",
              },
            ]

      setAppointments(mockAppointments)
      setFilteredAppointments(mockAppointments)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = appointments

    // Filter by status
    if (filter !== "ALL") {
      filtered = filtered.filter((appointment) => appointment.status === filter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredAppointments(filtered)
  }, [filter, searchTerm, appointments])

  const handleCancelAppointment = (id: number) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status: "CANCELLED" as const } : appointment,
    )

    setAppointments(updatedAppointments)

    // Update localStorage
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-4 h-4" />
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />
      case "CANCELLED":
        return <X className="w-4 h-4" />
      default:
        return null
    }
  }

  const getAppointmentTypeLabel = (type: string) => {
    switch (type) {
      case "consultation":
        return "General Consultation"
      case "followup":
        return "Follow-up Visit"
      case "checkup":
        return "Health Checkup"
      case "emergency":
        return "Emergency"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">My Appointments</span>
              </div>
              <Link href="/appointments/book">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  Book New Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <Card className="shadow-lg border-0 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                {(["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    onClick={() => setFilter(status)}
                    className={`${filter === status ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    size="sm"
                  >
                    {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                    <Badge variant="secondary" className="ml-2">
                      {status === "ALL" ? appointments.length : appointments.filter((a) => a.status === status).length}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card className="text-center py-16 shadow-lg border-0">
            <CardContent>
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Appointments Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm
                  ? "No appointments match your search criteria. Try adjusting your search or filters."
                  : filter === "ALL"
                    ? "You don't have any appointments yet. Book your first appointment to get started."
                    : `No ${filter.toLowerCase()} appointments found.`}
              </p>
              <Link href="/appointments/book">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Your First Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden"
              >
                <div className="flex">
                  <div
                    className={`w-2 ${
                      appointment.status === "SCHEDULED"
                        ? "bg-blue-500"
                        : appointment.status === "COMPLETED"
                          ? "bg-green-500"
                          : "bg-red-500"
                    }`}
                  ></div>

                  <div className="flex-1">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                {appointment.patientName}
                              </h3>
                              <p className="text-gray-600 mt-1">
                                Appointment #{appointment.id.toString().padStart(4, "0")}
                              </p>
                            </div>
                            <Badge
                              className={`${getStatusColor(appointment.status)} border flex items-center space-x-1`}
                            >
                              {getStatusIcon(appointment.status)}
                              <span>{appointment.status}</span>
                            </Badge>
                          </div>

                          {/* Doctor and Specialty */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Stethoscope className="w-4 h-4 text-gray-500" />
                              <div>
                                <span className="font-medium text-gray-900">{appointment.doctorName}</span>
                                <p className="text-sm text-gray-600">{appointment.specialization}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{appointment.location}</span>
                            </div>
                          </div>

                          {/* Date, Time, and Type */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">
                                {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">
                                {new Date(`2000-01-01T${appointment.appointmentTime}`).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">
                                {getAppointmentTypeLabel(appointment.appointmentType)}
                              </span>
                            </div>
                          </div>

                          {/* Symptoms and Notes */}
                          {appointment.symptoms && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 mb-2">Symptoms/Concerns:</h4>
                              <p className="text-gray-700 text-sm">{appointment.symptoms}</p>
                              {appointment.notes && (
                                <div className="mt-2">
                                  <h4 className="font-medium text-gray-900 mb-1">Additional Notes:</h4>
                                  <p className="text-gray-700 text-sm">{appointment.notes}</p>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            Booked on: {new Date(appointment.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                          {appointment.status === "SCHEDULED" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Calendar className="w-4 h-4 mr-1" />
                                Reschedule
                              </Button>
                            </>
                          )}
                          {appointment.status === "COMPLETED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View Report
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {appointments.filter((a) => a.status === "SCHEDULED").length}
              </div>
              <div className="text-gray-600 text-sm">Upcoming Appointments</div>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {appointments.filter((a) => a.status === "COMPLETED").length}
              </div>
              <div className="text-gray-600 text-sm">Completed Visits</div>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{appointments.length}</div>
              <div className="text-gray-600 text-sm">Total Appointments</div>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {new Set(appointments.map((a) => a.doctorName)).size}
              </div>
              <div className="text-gray-600 text-sm">Doctors Consulted</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
