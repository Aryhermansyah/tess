export interface Couple {
  groom: {
    name: string;
    fullName: string;
    photo: string;
    father: string;
    mother: string;
    childNumber: string;
    siblings: string;
    address: string;
    phone: string;
    instagram: string;
    bio: string;
    // Additional fields for compatibility
    nickname?: string;
    fatherName?: string;
    motherName?: string;
    siblingPosition?: string;
  };
  bride: {
    name: string;
    fullName: string;
    photo: string;
    father: string;
    mother: string;
    childNumber: string;
    siblings: string;
    address: string;
    phone: string;
    instagram: string;
    bio: string;
    // Additional fields for compatibility
    nickname?: string;
    fatherName?: string;
    motherName?: string;
    siblingPosition?: string;
  };
}

export interface Venue {
  name: string;
  address: string;
  mapUrl: string;
  directions: string;
  photo: string;
  mapPreviewUrl?: string;
}

export interface RundownItem {
  id: string;
  time: string;
  activity: string;
  personnel: string;
}

export interface Event {
  id: string;
  title: string;
  date?: string;
  time: string;
  venue?: string;
  description: string;
  location?: string;
  dress?: string;
  detailedRundown?: RundownItem[];
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  phone: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  instagram: string;
  website: string;
  logo: string;
  details?: string[];
  description?: string;
}

export interface Coordinator {
  id: string;
  name: string;
  role: string;
  phone: string;
  photo: string;
}

export interface MoodboardCategory {
  id: string;
  name: string;
}

export interface MoodboardItem {
  id: string;
  categoryId: string;
  imageUrl: string;
  description: string;
  source: string;
}

export interface WeddingTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  backgroundImage: string;
  accentImage: string;
}

export interface EventSummary {
  date?: string;
  place: string;
  eventType: string;
  ceremonyTime: string;
  receptionTime: string;
  ceremonyGuests: string;
  ceremonyGuestsDetail: string;
  receptionGuests: string;
  churchStaffSouvenir: string;
  churchStaffNote: string;
  receptionSouvenir: string;
  receptionSouvenirNote: string;
}

export interface WeddingState {
  couple: Couple;
  date: string;
  venue: Venue;
  theme: WeddingTheme;
  schedule: Event[];
  committee: CommitteeMember[];
  vendors: Vendor[];
  coordinators: Coordinator[];
  moodboard: MoodboardItem[];
  eventSummary?: EventSummary;
  updateCouple: (couple: Couple) => void;
  updateVenue: (venue: Venue) => void;
  updateTheme: (theme: WeddingTheme) => void;
  updateSchedule: (schedule: Event[]) => void;
  updateCommittee: (committee: CommitteeMember[]) => void;
  updateVendors: (vendors: Vendor[]) => void;
  updateCoordinators: (coordinators: Coordinator[]) => void;
  updateMoodboard: (moodboard: MoodboardItem[]) => void;
  updateEventSummary: (eventSummary: EventSummary) => void;
  resetToDefault: () => void;
}