"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Heart,
  Filter,
  Calendar,
  Award,
  Users,
} from "lucide-react"
import Link from "next/link"

interface Doctor {
  id: number
  name: string
  specialization: string
  qualification: string
  experience: number
  rating: number
  reviewCount: number
  availability: string
  location: string
  consultationFee: number
  languages: string[]
  image: string
  about: string
  nextAvailable: string
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockDoctors: Doctor[] = [
        {
          id: 1,
          name: "Dr. Priya Patel",
          specialization: "Cardiology",
          qualification: "MD, FACC",
          experience: 15,
          rating: 4.9,
          reviewCount: 324,
          availability: "Available",
          location: "Downtown Medical Center",
          consultationFee: 200,
          languages: ["English"],
          image: "/doctor-1.jpg",
          about:
            "Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions.",
          nextAvailable: "Today 2:00 PM",
        },
        {
          id: 2,
          name: "Dr. Rajesh Sharma",
          specialization: "Neurology",
          qualification: "MD, PhD",
          experience: 12,
          rating: 4.8,
          reviewCount: 256,
          availability: "Available",
          location: "Central Hospital",
          consultationFee: 250,
          languages: ["English", "Hindi"],
          image: "/doctor-2.jpg",
          about: "Specialized in neurological disorders with extensive research background in brain imaging.",
          nextAvailable: "Tomorrow 10:00 AM",
        },
        {
          id: 3,
          name: "Dr. Anil Kumar",
          specialization: "Pediatrics",
          qualification: "MD, FAAP",
          experience: 10,
          rating: 4.9,
          reviewCount: 412,
          availability: "Available",
          location: "Children's Medical Center",
          consultationFee: 150,
          languages: ["English"],
          image: "/doctor-3.jpg",
          about: "Dedicated pediatrician with a passion for child healthcare and development.",
          nextAvailable: "Today 4:30 PM",
        },
        {
          id: 4,
          name: "Dr. Vikram Singh",
          specialization: "Orthopedics",
          qualification: "MD, MS Ortho",
          experience: 18,
          rating: 4.7,
          reviewCount: 189,
          availability: "Busy",
          location: "Sports Medicine Clinic",
          consultationFee: 300,
          languages: ["English"],
          image: "/doctor-4.jpg",
          about: "Expert in sports injuries and joint replacement surgeries with cutting-edge techniques.",
          nextAvailable: "Next Week",
        },
        {
          id: 5,
          name: "Dr. Sunita Gupta",
          specialization: "Dermatology",
          qualification: "MD, FAAD",
          experience: 8,
          rating: 4.8,
          reviewCount: 298,
          availability: "Available",
          location: "Skin Care Center",
          consultationFee: 180,
          languages: ["English"],
          image: "/doctor-5.jpg",
          about: "Specializes in medical and cosmetic dermatology with focus on skin cancer prevention.",
          nextAvailable: "Tomorrow 1:00 PM",
        },
        {
          id: 6,
          name: "Dr. Arvind Mehta",
          specialization: "Internal Medicine",
          qualification: "MD, FACP",
          experience: 20,
          rating: 4.6,
          reviewCount: 445,
          availability: "Available",
          location: "General Hospital",
          consultationFee: 160,
          languages: ["English", "Hindi"],
          image: "/doctor-6.jpg",
          about: "Experienced internist focusing on preventive care and chronic disease management.",
          nextAvailable: "Today 3:15 PM",
        },
      ]
      setDoctors(mockDoctors)
      setFilteredDoctors(mockDoctors)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = doctors

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((doctor) => doctor.specialization === selectedSpecialty)
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter((doctor) => doctor.location === selectedLocation)
    }

    setFilteredDoctors(filtered)
  }, [searchTerm, selectedSpecialty, selectedLocation, doctors])

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialization))]
  const locations = [...new Set(doctors.map((doctor) => doctor.location))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading our expert doctors...</p>
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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Find Doctors</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Find the Right Doctor for You</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Connect with our network of qualified healthcare professionals
            </p>
          </div>

          <Card className="max-w-4xl mx-auto shadow-2xl border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search doctors by name or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <Filter className="w-4 h-4 mr-2" />
                  {filteredDoctors.length} doctors found
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  <Users className="w-4 h-4 mr-1" />
                  {doctors.filter((d) => d.availability === "Available").length} Available Now
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Doctors Grid */}
      <main className="container mx-auto px-4 py-12">
        {filteredDoctors.length === 0 ? (
          <Card className="text-center py-16 max-w-2xl mx-auto">
            <CardContent>
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Doctors Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any doctors matching your search criteria. Try adjusting your filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedSpecialty("all")
                  setSelectedLocation("all")
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${
                        doctor.availability === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {doctor.availability}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      <Award className="w-3 h-3 mr-1" />
                      {doctor.experience}+ years
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                      <p className="text-sm text-gray-600">{doctor.qualification}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{doctor.rating}</span>
                        <span className="text-sm text-gray-600">({doctor.reviewCount} reviews)</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">${doctor.consultationFee}</div>
                        <div className="text-xs text-gray-600">Consultation</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Next available: {doctor.nextAvailable}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{doctor.about}</p>

                    <div className="flex gap-2 pt-4">
                      <Link href={`/appointments/book?doctorId=${doctor.id}`} className="flex-1">
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          disabled={doctor.availability !== "Available"}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon" className="hover:bg-blue-50 bg-transparent">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl max-w-4xl mx-auto border-0">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Can't Find the Right Doctor?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Our patient care coordinators are here to help you find the perfect healthcare provider for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us: +1 (555) 123-4567
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
