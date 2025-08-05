export interface Patient {
  id: number
  name: string
  firstName?: string
  lastName?: string
  email: string
  phone: string
  dateOfBirth?: string
  gender?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  medicalHistory?: string
  allergies?: string
  bloodGroup?: string
  registrationDate?: string
}

export interface Doctor {
  id: number
  name: string
  specialization: string
  qualification?: string
  experience?: number
  rating: number
  reviewCount?: number
  availability?: string
  location: string
  consultationFee: number
  languages?: string[]
  image?: string
  about?: string
  nextAvailable: string
}

export interface Appointment {
  id: number
  patientId?: string
  patientName: string
  doctorId?: string
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
