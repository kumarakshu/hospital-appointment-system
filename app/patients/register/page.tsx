"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Users, Heart, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PatientFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  medicalHistory: string
  allergies: string
  bloodGroup: string
}

export default function PatientRegistration() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalHistory: "",
    allergies: "",
    bloodGroup: "",
  })

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone)
      case 2:
        return !!(formData.dateOfBirth && formData.gender && formData.address)
      case 3:
        return !!(formData.emergencyContact && formData.emergencyPhone)
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
      setMessage(null)
    } else {
      setMessage({ type: "error", text: "Please fill in all required fields before proceeding." })
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setMessage(null)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setMessage({ type: "error", text: "Please complete all required fields." })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    // Simulate API call
    setTimeout(() => {
      // Get existing patients from localStorage
      const existingPatients = JSON.parse(localStorage.getItem("patients") || "[]")

      // Create new patient object
      const newPatient = {
        id: Date.now(), // Simple ID generation
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        medicalHistory: formData.medicalHistory,
        allergies: formData.allergies,
        bloodGroup: formData.bloodGroup,
        registrationDate: new Date().toISOString(),
      }

      // Add new patient to existing list
      const updatedPatients = [...existingPatients, newPatient]

      // Save back to localStorage
      localStorage.setItem("patients", JSON.stringify(updatedPatients))

      setMessage({
        type: "success",
        text: "Registration successful! Welcome to MediCare Plus. You can now book appointments.",
      })
      setIsSubmitting(false)

      // Redirect after success with patient ID
      setTimeout(() => {
        router.push(`/appointments/book?newPatient=true&patientId=${newPatient.id}`)
      }, 2000)
    }, 2000)
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Details", icon: Calendar },
    { number: 3, title: "Emergency", icon: Users },
    { number: 4, title: "Medical", icon: Heart },
  ]

  const currentStepIcon = steps[currentStep - 1].icon
  const currentStepTitle = steps[currentStep - 1].title

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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Patient Registration</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-4 transition-all duration-300 ${
                        currentStep > step.number ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 mt-1">
                {currentStep === 1 && "Let's start with your basic information"}
                {currentStep === 2 && "Tell us more about yourself"}
                {currentStep === 3 && "Emergency contact information"}
                {currentStep === 4 && "Medical history and preferences"}
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                {React.createElement(currentStepIcon, { className: "w-6 h-6 mr-3" })}
                {currentStepTitle} Information
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

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center text-sm font-medium">
                        <User className="w-4 h-4 mr-2" />
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center text-sm font-medium">
                        <User className="w-4 h-4 mr-2" />
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center text-sm font-medium">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center text-sm font-medium">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="flex items-center text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date of Birth *
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center text-sm font-medium">
                        <Users className="w-4 h-4 mr-2" />
                        Gender *
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center text-sm font-medium">
                      <MapPin className="w-4 h-4 mr-2" />
                      Complete Address *
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address including city, state, and postal code"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="min-h-[100px] border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium">
                      <Heart className="w-4 h-4 mr-2" />
                      Blood Group (Optional)
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => handleInputChange("bloodGroup", value)}
                    >
                      <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                        <SelectValue placeholder="Select your blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Emergency Contact */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                      <p className="text-amber-800 text-sm">
                        Please provide emergency contact information. This person will be contacted in case of medical
                        emergencies.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact" className="flex items-center text-sm font-medium">
                        <User className="w-4 h-4 mr-2" />
                        Emergency Contact Name *
                      </Label>
                      <Input
                        id="emergencyContact"
                        type="text"
                        placeholder="Full name of emergency contact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="flex items-center text-sm font-medium">
                        <Phone className="w-4 h-4 mr-2" />
                        Emergency Contact Phone *
                      </Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="Emergency contact phone number"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Medical Information */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-blue-600 mr-2" />
                      <p className="text-blue-800 text-sm">
                        This information helps our doctors provide better care. All medical information is kept strictly
                        confidential.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory" className="flex items-center text-sm font-medium">
                      <Heart className="w-4 h-4 mr-2" />
                      Medical History (Optional)
                    </Label>
                    <Textarea
                      id="medicalHistory"
                      placeholder="Please describe any significant medical conditions, surgeries, or ongoing treatments..."
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      className="min-h-[100px] border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="flex items-center text-sm font-medium">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Allergies & Medications (Optional)
                    </Label>
                    <Textarea
                      id="allergies"
                      placeholder="List any known allergies to medications, foods, or other substances..."
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      className="min-h-[100px] border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-8 py-3 bg-transparent"
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isSubmitting ? "Registering..." : "Complete Registration"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Our support team is available 24/7 to assist you with the registration process.
                </p>
                <div className="flex justify-center space-x-4">
                  <Badge variant="secondary" className="px-4 py-2">
                    <Phone className="w-4 h-4 mr-2" />
                    +1 (555) 123-4567
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2">
                    <Mail className="w-4 h-4 mr-2" />
                    support@medicareplus.com
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
