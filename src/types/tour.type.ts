export interface CreateTourType {
  title: string
  slug: string
  description: string
  // duration: string;
  // departure: string;
  // destinations: string[];
  content: string[]
  inclusions: string[]
  exclusions: string[]
  availableSlots: number
  status: 'active' | 'inactive'
  images: string[]
  categoryIdLevel3: string
}
