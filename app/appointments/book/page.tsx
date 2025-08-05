"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  Heart,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface Doctor {
  id: number
  name: string
  specialization: string
  rating: number
  location: string
  consultationFee: number
  nextAvailable: string
}

interface Patient {
  id: number
  name: string
  email: string
  phone: string
}

interface AppointmentForm {
  patientId: string
  doctorId: string
  appointmentDate: string
  appointmentTime: string
  appointmentType: string
  symptoms: string
  notes: string
}

export default function BookAppointment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState<AppointmentForm>({
    patientId: "",
    doctorId: searchParams?.get("doctorId") || "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "consultation",
    symptoms: "",
    notes: "",
  })

  useEffect(() => {
    // Load doctors and patients data
    setTimeout(() => {
      const mockDoctors: Doctor[] = [
        {
          id: 1,
          name: "Dr. Priya Patel",
          specialization: "Neurology",
          rating: 4.9,
          location: "Downtown Medical Center",
          consultationFee: 200,
          nextAvailable: "Today 2:00 PM",
        },
        {
          id: 2,
          name: "Dr. Rajesh Sharma",
          specialization: "Cardiology",
          rating: 4.8,
          location: "Central Hospital",
          consultationFee: 250,
          nextAvailable: "Tomorrow 10:00 AM",
        },
        {
          id: 3,
          name: "Dr. Sunita Gupta",
          specialization: "Dermatology",
          rating: 4.9,
          location: "Children's Medical Center",
          consultationFee: 150,
          nextAvailable: "Today 4:30 PM",
        },
      ]

      // Load patients from localStorage
      const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")

      // If no patients in localStorage, use default mock data
      const mockPatients: Patient[] =
        storedPatients.length > 0
          ? storedPatients
          : [
              { id: 1, name: "user1", email: "user1@example.com", phone: "8987674573" },
              { id: 2, name: "user2", email: "user2@example.com", phone: "9534768356" },
              { id: 3, name: "user3", email: "user3@example.com", phone: "7656478398" },
            ]

      setDoctors(mockDoctors)
      setPatients(mockPatients)

      // Pre-select doctor if provided in URL
      if (formData.doctorId) {
        const doctor = mockDoctors.find((d) => d.id.toString() === formData.doctorId)
        if (doctor) setSelectedDoctor(doctor)
      }

      // Pre-select patient if provided in URL (for newly registered patients)
      const urlPatientId = searchParams?.get("patientId")
      if (urlPatientId) {
        setFormData((prev) => ({ ...prev, patientId: urlPatientId }))
      }
    }, 500)
  }, [formData.doctorId, searchParams])

  const handleInputChange = (field: keyof AppointmentForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "doctorId") {
      const doctor = doctors.find((d) => d.id.toString() === value)
      setSelectedDoctor(doctor || null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validation
    if (!formData.patientId || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      setMessage({ type: "error", text: "Please fill in all required fields." })
      return
    }

    setIsSubmitting(true)

    // Simulate API call and save appointment
    setTimeout(() => {
      // Get existing appointments from localStorage
      const existingAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")

      // Find patient and doctor details
      const patient = patients.find((p) => p.id.toString() === formData.patientId)
      const doctor = doctors.find((d) => d.id.toString() === formData.doctorId)

      // Create new appointment object
      const newAppointment = {
        id: Date.now(),
        patientId: formData.patientId,
        patientName: patient?.name || "Unknown Patient",
        doctorId: formData.doctorId,
        doctorName: doctor?.name || "Unknown Doctor",
        specialization: doctor?.specialization || "General",
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        appointmentType: formData.appointmentType,
        symptoms: formData.symptoms,
        notes: formData.notes,
        status: "SCHEDULED",
        location: doctor?.location || "Hospital",
        createdAt: new Date().toISOString(),
      }

      // Add new appointment to existing list
      const updatedAppointments = [...existingAppointments, newAppointment]

      // Save back to localStorage
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments))

      setMessage({
        type: "success",
        text: "Appointment booked successfully! You will receive a confirmation email shortly.",
      })
      setIsSubmitting(false)

      // Redirect after success
      setTimeout(() => {
        router.push("/appointments")
      }, 2000)
    }, 2000)
  }

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/doctors"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Doctors
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Book Appointment</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Schedule your visit with our expert healthcare professionals
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center">
                    <Calendar className="w-6 h-6 mr-3" />
                    Appointment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {message && (
                    <div
                      className={`mb-6 p-4 rounded-lg flex items-center ${
                        message.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {message.type === "success" ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                      )}
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Selection */}
                    <div className="space-y-2">
                      <Label className="flex items-center text-sm font-medium">
                        <User className="w-4 h-4 mr-2" />
                        Select Patient *
                      </Label>
                      <Select
                        value={formData.patientId}
                        onValueChange={(value) => handleInputChange("patientId", value)}
                      >
                        <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                          <SelectValue placeholder="Choose patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{patient.name}</span>
                                <span className="text-sm text-gray-500">{patient.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Don't see your name?{" "}
                        <Link href="/patients/register" className="text-blue-600 hover:underline font-medium">
                          Register as a new patient
                        </Link>
                      </p>
                    </div>

                    {/* Doctor Selection */}
                    <div className="space-y-2">
                      <Label className="flex items-center text-sm font-medium">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Select Doctor *
                      </Label>
                      <Select value={formData.doctorId} onValueChange={(value) => handleInputChange("doctorId", value)}>
                        <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                          <SelectValue placeholder="Choose doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{doctor.name}</span>
                                <span className="text-sm text-gray-500">
                                  {doctor.specialization} • ${doctor.consultationFee}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="appointmentDate" className="flex items-center text-sm font-medium">
                          <Calendar className="w-4 h-4 mr-2" />
                          Appointment Date *
                        </Label>
                        <Input
                          id="appointmentDate"
                          type="date"
                          value={formData.appointmentDate}
                          onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                          min={today}
                          className="h-12 border-2 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center text-sm font-medium">
                          <Clock className="w-4 h-4 mr-2" />
                          Appointment Time *
                        </Label>
                        <Select
                          value={formData.appointmentTime}
                          onValueChange={(value) => handleInputChange("appointmentTime", value)}
                        >
                          <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Appointment Type */}
                    <div className="space-y-2">
                      <Label className="flex items-center text-sm font-medium">
                        <FileText className="w-4 h-4 mr-2" />
                        Appointment Type *
                      </Label>
                      <Select
                        value={formData.appointmentType}
                        onValueChange={(value) => handleInputChange("appointmentType", value)}
                      >
                        <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">General Consultation</SelectItem>
                          <SelectItem value="followup">Follow-up Visit</SelectItem>
                          <SelectItem value="checkup">Health Checkup</SelectItem>
                          <SelectItem value="emergency">Emergency Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Symptoms */}
                    <div className="space-y-2">
                      <Label htmlFor="symptoms" className="flex items-center text-sm font-medium">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Primary Symptoms/Concerns
                      </Label>
                      <Textarea
                        id="symptoms"
                        placeholder="Please describe your main symptoms or reason for the visit..."
                        value={formData.symptoms}
                        onChange={(e) => handleInputChange("symptoms", e.target.value)}
                        className="min-h-[100px] border-2 focus:border-blue-500"
                      />
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="flex items-center text-sm font-medium">
                        <FileText className="w-4 h-4 mr-2" />
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information you'd like the doctor to know..."
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="min-h-[80px] border-2 focus:border-blue-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? "Booking Appointment..." : "Book Appointment"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Doctor Info */}
              {selectedDoctor && (
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                    <CardTitle className="text-lg text-gray-900">Selected Doctor</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Heart className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-900">{selectedDoctor.name}</h3>
                        <p className="text-blue-600 font-medium">{selectedDoctor.specialization}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-medium">{selectedDoctor.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium text-right">{selectedDoctor.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Consultation Fee:</span>
                          <span className="font-bold text-green-600">${selectedDoctor.consultationFee}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Next Available:</span>
                          <span className="font-medium text-blue-600">{selectedDoctor.nextAvailable}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Important Notes */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-sm text-amber-800">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      Arrive 15 minutes before your appointment
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      Bring a valid ID and insurance card
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      List of current medications
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      Previous medical records if available
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 text-amber-600" />
                      Cancellations must be made 24 hours in advance
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">Our support team is here to assist you</p>
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
