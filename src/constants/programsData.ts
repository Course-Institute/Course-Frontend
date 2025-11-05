export interface Course {
  id: string;
  name: string;
  duration: string;
  eligibility: string;
  durationUnit?: 'Month' | 'Year';
}

export interface ProgramLevel {
  id: string;
  level: 'Certificate' | 'Diploma';
  eligibility: '10th' | '12th';
  courses: Course[];
}

export interface Program {
  id: string;
  category: string;
  focusArea: string;
  description: string;
  color: string;
  image: string;
  levels: ProgramLevel[];
  background?: string;
}

// Import IT, Vocational, Beauty & Wellness, Apparel, and Agriculture programs
import { itProgramsData } from './itProgramsData';
import { vocationalProgramsData } from './vocationalProgramsData';
import { beautyWellnessProgramsData } from './beautyWellnessProgramsData';
import { apparelProgramsData } from './apparelProgramsData';
import { agricultureProgramsData } from './agricultureProgramsData';

export const programsData: Program[] = [
  {
    id: "paramedical",
    category: "Paramedical",
    focusArea: "Healthcare support, diagnostics",
    description: "Step into the vital world of healthcare. Our paramedical courses train students in diagnostic, technical, and patient care skills. Graduates are prepared to work in hospitals, labs, and clinics.",
    color: "#00184dff",
    image: "https://images.unsplash.com/photo-1572996489045-96ed977a73b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    levels: [
      {
        id: "paramedical-cert-12th",
        level: "Certificate",
        eligibility: "12th",
        courses: [
          { id: "occupational-therapist", name: "Occupational Therapist", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ecg-assistant", name: "ECG Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-lab-technology", name: "Medical Lab Technology", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "operation-theater-technician", name: "Operation Theater Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "cardiac-care-technician", name: "Cardiac Care Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "blood-bank-technician", name: "Blood Bank Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-lab-assistant", name: "Medical Lab Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "cath-lab-technician", name: "Cath-Lab-Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "nursing-assistant", name: "Nursing Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "x-ray-technician", name: "X-Ray Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "dental-assistant", name: "Dental Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ophthalmic-assistant", name: "Ophthalmic Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ct-scan-technician", name: "CT Scan Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "dialysis-technology", name: "Dialysis Technology", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "mri-technician", name: "MRI Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "cardiac-critical-care", name: "Cardiac Critical Care", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "general-duty-assistant", name: "General Duty Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "radiology-technician", name: "Radiology Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "patient-care", name: "Patient Care", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "dietitian", name: "Dietitian", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "emergency-medical-services", name: "Emergency Medical Services", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "blood-bank-assistant", name: "Blood Bank Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "old-age-care", name: "Old Age Care", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "hospital-assistant-technician", name: "Hospital Assistant & Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "optometry", name: "Optometry", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "physiotherapy", name: "Physiotherapy", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "radio-imaging-technology", name: "Radio Imaging Technology", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "dresser", name: "Dresser", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "diet-nutrition", name: "Diet & Nutrition", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "first-aid", name: "First Aid", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "physiotherapy-assistant", name: "Physiotherapy Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ultrasound", name: "Ultrasound", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ecg", name: "ECG", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "community-health-worker", name: "Community Health Worker", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "frontline-health-worker", name: "Frontline Heath Worker", duration: "1", durationUnit: "Year", eligibility: "12th" }
        ]
      },
      {
        id: "paramedical-diploma-12th",
        level: "Diploma",
        eligibility: "12th",
        courses: [
          { id: "dialysis-technician-diploma", name: "Dialysis Technician", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "operation-theatre-assistant-diploma", name: "Operation Theatre Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "x-ray-technology-diploma", name: "X Ray Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "radiology-imaging-technology-diploma", name: "Radiology & Imaging Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ecg-technology-diploma", name: "ECG Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ophthalmic-technology-diploma", name: "Ophthalmic Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-lab-technology-diploma", name: "Medical Lab Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "physiotherapy-diploma", name: "Physiotherapy", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "nursing-assistant-diploma", name: "Nursing Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "health-sanitary-inspector-diploma", name: "Health & Sanitary Inspector", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "dental-hygienist-diploma", name: "Dental Hygienist", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "optometry-diploma", name: "Optometry", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "physician-assistant-diploma", name: "Physician Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-radiography-technician-diploma", name: "Medical Radiography Technician", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "dental-assistant-diploma", name: "Dental Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "patient-care-diploma", name: "Patient Care", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "patient-care-assistant-diploma", name: "Patient Care Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-record-keeper-diploma", name: "Medical Record Keeper", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "multi-purpose-health-worker-diploma", name: "Multi Purpose Health Worker", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "hospital-waste-management-diploma", name: "Hospital Waste Management", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "health-care-assistant-diploma", name: "Health Care Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "mri-diploma", name: "MRI", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "cath-lab-technician-diploma", name: "Cath-Lab-Technician", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ultrasound-diploma", name: "Ultrasound", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "dental-technician-diploma", name: "Dental Technician", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "dietician-diploma", name: "Dietician", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "icu-technician-diploma", name: "ICU Technician", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "pharmacy-assistant-diploma", name: "Pharmacy Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "community-health-worker-diploma", name: "Community Health Worker", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "homoeopathic-pharmacy-diploma", name: "Homoeopathic Pharmacy", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "blood-bank-technician-diploma", name: "Blood Bank Technician", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-representative-diploma", name: "Medical Representative", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "occupational-therapist-diploma", name: "Occupational Therapist", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "x-ray-technician-diploma", name: "X-Ray Technician", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "operation-theatre-technician-diploma", name: "Operation Theatre Techincian", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "first-aid-diploma", name: "First Aid", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ct-scan-technology-diploma", name: "CT Scan Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "dialysis-technology-diploma", name: "Dialysis Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "emergency-medical-technology-diploma", name: "Emergency Medical Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "hospital-management-diploma", name: "Hospital Management", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-assistant-diploma", name: "Medical Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-dresser-diploma", name: "Medical Dresser", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "medical-transcription-diploma", name: "Medical Transcription", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "mri-scan-technology-diploma", name: "MRI Scan Technology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "multi-purpose-health-worker-female-diploma", name: "Multi Purpose Health Worker (Female)", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "multi-purpose-health-worker-male-diploma", name: "Multi Purpose Health Worker (Male)", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "nursing-diploma", name: "Nursing", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "nursing-administration-diploma", name: "Nursing Administration", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "trauma-care-casualty-technology-diploma", name: "Trauma Care & Casualty Technology", duration: "2", durationUnit: "Year", eligibility: "12th" }
        ]
      },
      {
        id: "paramedical-diploma-10th",
        level: "Diploma",
        eligibility: "10th",
        courses: [
          { id: "dialysis-technician-10th", name: "Dialysis Technician", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "operation-theatre-assistant-10th", name: "Operation Theatre Assistant", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "x-ray-technology-10th", name: "X Ray Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "radiology-imaging-technology-10th", name: "Radiology & Imaging Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "ecg-technology-10th", name: "ECG Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "ophthalmic-technology-10th", name: "Ophthalmic Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "medical-lab-technology-10th", name: "Medical Lab Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "physiotherapy-10th", name: "Physiotherapy", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "nursing-assistant-10th", name: "Nursing Assistant", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "health-sanitary-inspector-10th", name: "Health & Sanitary Inspector", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "dental-hygienist-10th", name: "Dental Hygienist", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "optometry-10th", name: "Optometry", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "physician-assistant-10th", name: "Physician Assistant", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "medical-radiography-technician-10th", name: "Medical Radiography Technician", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "dental-assistant-10th", name: "Dental Assistant", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "patient-care-10th", name: "Patient Care", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "patient-care-assistant-10th", name: "Patient Care Assistant", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "medical-record-keeper-10th", name: "Medical Record Keeper", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "multi-purpose-health-worker-10th", name: "Multi Purpose Health Worker", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "hospital-waste-management-10th", name: "Hospital Waste Management", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "health-care-assistant-10th", name: "Health Care Assistant", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "mri-10th", name: "MRI", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "cath-lab-technician-10th", name: "Cath-Lab-Technician", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "ultrasound-10th", name: "Ultrasound", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "dental-technician-10th", name: "Dental Technician", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "dietician-10th", name: "Dietician", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "icu-technician-10th", name: "ICU Technician", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "pharmacy-assistant-10th", name: "Pharmacy Assistant", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "community-health-worker-10th", name: "Community Health Worker", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "homoeopathic-pharmacy-10th", name: "Homoeopathic Pharmacy", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "blood-bank-technician-10th", name: "Blood Bank Technician", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "medical-representative-10th", name: "Medical Representative", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "occupational-therapist-10th", name: "Occupational Therapist", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "x-ray-technician-10th", name: "X-Ray Technician", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "operation-theatre-technician-10th", name: "Operation Theatre Techincian", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "first-aid-10th", name: "First Aid", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "ct-scan-technology-10th", name: "CT Scan Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "dialysis-technology-10th", name: "Dialysis Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "emergency-medical-technology-10th", name: "Emergency Medical Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "hospital-management-10th", name: "Hospital Management", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "medical-assistant-10th", name: "Medical Assistant", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "medical-dresser-10th", name: "Medical Dresser", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "medical-transcription-10th", name: "Medical Transcription", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "mri-scan-technology-10th", name: "MRI Scan Technology", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "multi-purpose-health-worker-female-10th", name: "Multi Purpose Health Worker (Female)", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "multi-purpose-health-worker-male-10th", name: "Multi Purpose Health Worker (Male)", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "nursing-10th", name: "Nursing", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "nursing-administration-10th", name: "Nursing Administration", duration: "2", durationUnit: "Year", eligibility: "10th" },
          { id: "trauma-care-casualty-technology-10th", name: "Trauma Care & Casualty Technology", duration: "2", durationUnit: "Year", eligibility: "10th" }
        ]
      }
    ]
  },
  {
    id: "fire-safety",
    category: "Fire Safety",
    focusArea: "Emergency response, safety training",
    description: "Specialized training that saves lives. Learn how to handle emergencies, prevent hazards, and manage fire safety equipment. Prepares students for roles in industries, buildings, safety departments, and government sectors.",
    color: "#00184dff",
    image: "https://images.unsplash.com/photo-1575867094974-9e16b6f55360?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    levels: [
      {
        id: "fire-safety-cert-12th",
        level: "Certificate",
        eligibility: "12th",
        courses: [
          { id: "fire-safety-cert-12th", name: "Fire Safety", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "industrial-safety-cert-12th", name: "Industrial Safety", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "fire-technician-cert-12th", name: "Fire Technician", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "fire-fighting-cert-12th", name: "Fire Fighting", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "fire-safety-engineering-techniques-cert-12th", name: "Fire & Safety Engineering Techniques", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "fire-industrial-safety-management-cert-12th", name: "Fire & Industrial Safety Management", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "occupational-safety-health-cert-12th", name: "Occupational Safety & Health", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "fire-engineering-cert-12th", name: "Fire Engineering", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "fire-safety-management-cert-12th", name: "Fire Safety Management", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "fire-safety-hazard-management-cert-12th", name: "Fire Safety & Hazard Management", duration: "6", durationUnit: "Month", eligibility: "12th" },
          { id: "sub-fire-officer-cert-12th", name: "Sub-Fire Officer", duration: "6", durationUnit: "Month", eligibility: "12th" }
        ]
      },
      {
        id: "fire-safety-diploma-12th",
        level: "Diploma",
        eligibility: "12th",
        courses: [
          { id: "fire-safety-diploma-12th", name: "Fire Safety", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "industrial-safety-diploma-12th", name: "Industrial Safety", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "fire-technician-diploma-12th", name: "Fire Technician", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "fire-fighting-diploma-12th", name: "Fire Fighting", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "fire-safety-engineering-techniques-diploma-12th", name: "Fire & Safety Engineering Techniques", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "fire-industrial-safety-management-diploma-12th", name: "Fire & Industrial Safety Management", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "occupational-safety-health-diploma-12th", name: "Occupational Safety & Health", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "fire-engineering-diploma-12th", name: "Fire Engineering", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "fire-safety-management-diploma-12th", name: "Fire Safety Management", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "fire-safety-hazard-management-diploma-12th", name: "Fire Safety & Hazard Management", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "sub-fire-officer-diploma-12th", name: "Sub-Fire Officer", duration: "1", durationUnit: "Year", eligibility: "12th" }
        ]
      },
      {
        id: "fire-safety-cert-10th",
        level: "Certificate",
        eligibility: "10th",
        courses: [
          { id: "fire-safety-cert-10th", name: "Fire Safety", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "industrial-safety-cert-10th", name: "Industrial Safety", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "fire-technician-cert-10th", name: "Fire Technician", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "fire-fighting-cert-10th", name: "Fire Fighting", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "fire-safety-engineering-techniques-cert-10th", name: "Fire & Safety Engineering Techniques", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "fire-industrial-safety-management-cert-10th", name: "Fire & Industrial Safety Management", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "occupational-safety-health-cert-10th", name: "Occupational Safety & Health", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "fire-engineering-cert-10th", name: "Fire Engineering", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "fire-safety-management-cert-10th", name: "Fire Safety Management", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "fire-safety-hazard-management-cert-10th", name: "Fire Safety & Hazard Management", duration: "6", durationUnit: "Month", eligibility: "10th" },
          { id: "sub-fire-officer-cert-10th", name: "Sub-Fire Officer", duration: "6", durationUnit: "Month", eligibility: "10th" }
        ]
      },
      {
        id: "fire-safety-diploma-10th",
        level: "Diploma",
        eligibility: "10th",
        courses: [
          { id: "fire-safety-diploma-10th", name: "Fire Safety", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "industrial-safety-diploma-10th", name: "Industrial Safety", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "fire-technician-diploma-10th", name: "Fire Technician", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "fire-fighting-diploma-10th", name: "Fire Fighting", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "fire-safety-engineering-techniques-diploma-10th", name: "Fire & Safety Engineering Techniques", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "fire-industrial-safety-management-diploma-10th", name: "Fire & Industrial Safety Management", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "occupational-safety-health-diploma-10th", name: "Occupational Safety & Health", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "fire-engineering-diploma-10th", name: "Fire Engineering", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "fire-safety-management-diploma-10th", name: "Fire Safety Management", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "fire-safety-hazard-management-diploma-10th", name: "Fire Safety & Hazard Management", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "sub-fire-officer-diploma-10th", name: "Sub-Fire Officer", duration: "1", durationUnit: "Year", eligibility: "10th" }
        ]
      }
    ]
  },
  {
    id: "ntt",
    category: "NTT",
    focusArea: "Early childhood education",
    description: "Shape young minds and build a career in education. Provides insights into child development, classroom management, and early learning strategies.",
    color: "#00184dff",
    image: "https://images.unsplash.com/photo-1600173845923-ad1412bfab75?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    levels: [
      {
        id: "ntt-cert-10th",
        level: "Certificate",
        eligibility: "10th",
        courses: [
          { id: "primary-education-cert-10th", name: "Primary Education", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "pre-primary-education-cert-10th", name: "Pre-Primary Education", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "nursery-education-cert-10th", name: "Nursery Education", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "montessori-child-education-cert-10th", name: "Montessori and Child Education", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "creche-pre-school-management-cert-10th", name: "Creche and Pre-School Management", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "anganwadi-worker-cert-10th", name: "Anganwadi Worker", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "anganwadi-supervisor-cert-10th", name: "Anganwadi Supervisor", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "early-childhood-care-education-cert-10th", name: "Early Childhood Care and Education", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "primary-teachers-training-cert-10th", name: "Primary Teachers Training", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "nursery-teacher-training-cert-10th", name: "Nursery Teacher Training", duration: "1", durationUnit: "Year", eligibility: "10th" },
          { id: "nursery-primary-teacher-training-cert-10th", name: "Nursery Primary Teacher Training", duration: "1", durationUnit: "Year", eligibility: "10th" }
        ]
      },
      {
        id: "ntt-diploma-12th",
        level: "Diploma",
        eligibility: "12th",
        courses: [
          { id: "primary-education-diploma-12th", name: "Primary Education", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "pre-primary-education-diploma-12th", name: "Pre-Primary Education", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "nursery-education-diploma-12th", name: "Nursery Education", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "montessori-child-education-diploma-12th", name: "Montessori and Child Education", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "creche-pre-school-management-diploma-12th", name: "Creche and Pre-School Management", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "anganwadi-worker-diploma-12th", name: "Anganwadi Worker", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "anganwadi-supervisor-diploma-12th", name: "Anganwadi Supervisor", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "early-childhood-care-education-diploma-12th", name: "Early Childhood Care and Education", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "primary-teachers-training-diploma-12th", name: "Primary Teachers Training", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "nursery-teacher-training-diploma-12th", name: "Nursery Teacher Training", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "nursery-primary-teacher-training-diploma-12th", name: "Nursery Primary Teacher Training", duration: "1", durationUnit: "Year", eligibility: "12th" }
        ]
      }
    ]
  },
  {
    id: "yoga-naturopathy",
    category: "Yoga & Naturopathy",
    focusArea: "Holistic health, therapy",
    description: "A perfect combination of traditional wisdom and modern wellness. Yoga programs focus on body, mind, and spirit. Preparing students to become certified Yoga Trainers, Naturopaths, and Wellness Therapists.",
    color: "#00184dff",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1220",
    levels: [
      {
        id: "yoga-cert-12th",
        level: "Certificate",
        eligibility: "12th",
        courses: [
          { id: "ayurveda-cert-12th", name: "Ayurveda", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurveda-health-care-yoga-cert-12th", name: "Ayurveda Health Care & Yoga", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurveda-nursing-assistant-cert-12th", name: "Ayurveda Nursing Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurveda-pharmacy-cert-12th", name: "Ayurveda Pharmacy", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurveda-science-cert-12th", name: "Ayurveda Science", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurvedha-pharmacy-assistant-cert-12th", name: "Ayurvedha Pharmacy Assistant", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurvedic-clinical-pathology-cert-12th", name: "Ayurvedic Clinical Pathology", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurvedic-general-practices-cert-12th", name: "Ayurvedic General Practices", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "drug-store-management-cert-12th", name: "Drug Store Management", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "massage-therapy-cert-12th", name: "Massage Therapy", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "meditation-cert-12th", name: "Meditation", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "naturopathy-cert-12th", name: "Naturopathy", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "panchakarma-cert-12th", name: "Panchakarma", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "teaching-yoga-cert-12th", name: "Teaching Yoga", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "yog-acharya-cert-12th", name: "Yog Acharya", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "yoga-cert-12th", name: "Yoga", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "yoga-naturopathy-cert-12th", name: "Yoga & Naturopathy", duration: "1", durationUnit: "Year", eligibility: "12th" },
          { id: "yogic-science-cert-12th", name: "Yogic Science", duration: "1", durationUnit: "Year", eligibility: "12th" }
        ]
      },
      {
        id: "yoga-diploma-12th",
        level: "Diploma",
        eligibility: "12th",
        courses: [
          { id: "ayurveda-diploma-12th", name: "Ayurveda", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurveda-health-care-yoga-diploma-12th", name: "Ayurveda Health Care & Yoga", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurveda-nursing-assistant-diploma-12th", name: "Ayurveda Nursing Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurveda-pharmacy-diploma-12th", name: "Ayurveda Pharmacy", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurveda-science-diploma-12th", name: "Ayurveda Science", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurvedha-pharmacy-assistant-diploma-12th", name: "Ayurvedha Pharmacy Assistant", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurvedic-clinical-pathology-diploma-12th", name: "Ayurvedic Clinical Pathology", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "ayurvedic-general-practices-diploma-12th", name: "Ayurvedic General Practices", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "drug-store-management-diploma-12th", name: "Drug Store Management", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "massage-therapy-diploma-12th", name: "Massage Therapy", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "meditation-diploma-12th", name: "Meditation", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "naturopathy-diploma-12th", name: "Naturopathy", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "panchakarma-diploma-12th", name: "Panchakarma", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "teaching-yoga-diploma-12th", name: "Teaching Yoga", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "yog-acharya-diploma-12th", name: "Yog Acharya", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "yoga-diploma-12th", name: "Yoga", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "yoga-naturopathy-diploma-12th", name: "Yoga & Naturopathy", duration: "2", durationUnit: "Year", eligibility: "12th" },
          { id: "yogic-science-diploma-12th", name: "Yogic Science", duration: "2", durationUnit: "Year", eligibility: "12th" }
        ]
      },
      {
        id: "yoga-diploma-10th",
        level: "Diploma",
        eligibility: "10th",
        courses: [
          { id: "ayurveda-diploma-10th", name: "Ayurveda", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "ayurveda-health-care-yoga-diploma-10th", name: "Ayurveda Health Care & Yoga", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "ayurveda-nursing-assistant-diploma-10th", name: "Ayurveda Nursing Assistant", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "ayurveda-pharmacy-diploma-10th", name: "Ayurveda Pharmacy", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "ayurveda-science-diploma-10th", name: "Ayurveda Science", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "ayurvedha-pharmacy-assistant-diploma-10th", name: "Ayurvedha Pharmacy Assistant", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "ayurvedic-clinical-pathology-diploma-10th", name: "Ayurvedic Clinical Pathology", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "ayurvedic-general-practices-diploma-10th", name: "Ayurvedic General Practices", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "drug-store-management-diploma-10th", name: "Drug Store Management", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "massage-therapy-diploma-10th", name: "Massage Therapy", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "meditation-diploma-10th", name: "Meditation", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "naturopathy-diploma-10th", name: "Naturopathy", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "panchakarma-diploma-10th", name: "Panchakarma", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "teaching-yoga-diploma-10th", name: "Teaching Yoga", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "yog-acharya-diploma-10th", name: "Yog Acharya", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "yoga-diploma-10th", name: "Yoga", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "yoga-naturopathy-diploma-10th", name: "Yoga & Naturopathy", duration: "2", durationUnit: "Year", eligibility: "10th", },
          { id: "yogic-science-diploma-10th", name: "Yogic Science", duration: "2", durationUnit: "Year", eligibility: "10th", }
        ]
      }
    ]
  },
  // Import IT, Vocational, Beauty & Wellness, Apparel, and Agriculture programs
  itProgramsData,
  vocationalProgramsData,
  beautyWellnessProgramsData,
  apparelProgramsData,
  agricultureProgramsData
];