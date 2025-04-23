import { Couple, Venue, Event, CommitteeMember, Vendor, Coordinator, MoodboardItem, WeddingTheme, EventSummary, RundownItem } from '@/types';

export const mockWeddingData = {
  couple: {
    groom: {
      name: 'Davis',
      fullName: 'Davis Sandy Eka Prasetyo',
      photo: 'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80',
      father: 'Marjuki',
      mother: 'Siwati',
      childNumber: 'pertama dari 3 bersaudara',
      siblings: 'pertama dari 3 bersaudara',
      address: 'Kartosari Ponggok',
      phone: '+6281234567890',
      instagram: '@davis_p',
      bio: 'Putra pertama dari Bapak Marjuki dan Ibu Siwati. Lahir di Blitar pada tanggal 15 Mei 1990. Saat ini bekerja sebagai Software Engineer di perusahaan teknologi terkemuka.'
    },
    bride: {
      name: 'Fera',
      fullName: 'Fera Dela Santi',
      photo: 'https://images.unsplash.com/photo-1609241728358-55bdd86c92f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      father: 'Suprayono',
      mother: 'Siti Zulaikah',
      childNumber: 'ke-4 dari 4 bersaudara',
      siblings: 'ke-4 dari 4 bersaudara',
      address: 'Jabung Kras',
      phone: '+6287654321098',
      instagram: '@fera_d',
      bio: 'Putri keempat dari Bapak Suprayono dan Ibu Siti Zulaikah. Lahir di Kediri pada tanggal 22 September 1992. Saat ini bekerja sebagai Guru di salah satu sekolah dasar di Kediri.'
    }
  },
  date: '20 Oktober 2024',
  venue: {
    name: 'Griya Joglo',
    address: 'Jl. Raya Ponggok No. 123, Blitar, Jawa Timur',
    mapUrl: 'https://maps.google.com/?q=-8.0478,112.1615',
    directions: 'Lokasi berada di sebelah utara Alun-alun Blitar, sekitar 5 menit dari pusat kota.',
    photo: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2098&q=80'
  },
  theme: {
    id: 'classic',
    name: 'Classic Elegance',
    primaryColor: '#8B4513',
    secondaryColor: '#F5DEB3',
    fontFamily: 'serif',
    backgroundImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    accentImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
  },
  schedule: [
    {
      id: '1',
      title: 'Pemberkatan',
      time: '14:00 - 15:30 WIB',
      venue: 'Gereja GKJW Ponggok',
      description: 'Upacara pemberkatan pernikahan akan dilaksanakan secara sederhana dan khidmat.',
      dress: 'Putih & Gold',
      detailedRundown: [
        {
          id: '1-1',
          time: '13:30 - 14:00',
          activity: 'Registrasi Tamu',
          personnel: 'Tim Penerima Tamu'
        },
        {
          id: '1-2',
          time: '14:00 - 14:15',
          activity: 'Prosesi Masuk Pengantin',
          personnel: 'Pengantin & Keluarga'
        },
        {
          id: '1-3',
          time: '14:15 - 15:00',
          activity: 'Upacara Pemberkatan',
          personnel: 'Pendeta & Majelis Gereja'
        },
        {
          id: '1-4',
          time: '15:00 - 15:30',
          activity: 'Sesi Foto Bersama',
          personnel: 'Fotografer & Keluarga'
        }
      ]
    },
    {
      id: '2',
      title: 'Resepsi',
      time: '15:30 - 18:00 WIB',
      venue: 'Griya Joglo',
      description: 'Acara resepsi pernikahan dengan konsep garden party yang elegan.',
      dress: 'Formal Elegant',
      detailedRundown: [
        {
          id: '2-1',
          time: '15:30 - 16:00',
          activity: 'Penyambutan Tamu',
          personnel: 'Tim Penerima Tamu'
        },
        {
          id: '2-2',
          time: '16:00 - 16:30',
          activity: 'Pembukaan & Sambutan',
          personnel: 'MC & Keluarga'
        },
        {
          id: '2-3',
          time: '16:30 - 17:00',
          activity: 'Makan Malam',
          personnel: 'Tim Katering'
        },
        {
          id: '2-4',
          time: '17:00 - 17:30',
          activity: 'Hiburan & Persembahan',
          personnel: 'Tim Musik'
        },
        {
          id: '2-5',
          time: '17:30 - 18:00',
          activity: 'Sesi Foto & Penutupan',
          personnel: 'Fotografer & MC'
        }
      ]
    }
  ],
  committee: [
    {
      id: '1',
      name: 'Budi Santoso',
      role: 'Ketua Panitia',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      phone: '+6281234567891'
    },
    {
      id: '2',
      name: 'Siti Rahayu',
      role: 'Sekretaris',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      phone: '+6281234567892'
    },
    {
      id: '3',
      name: 'Hendra Wijaya',
      role: 'Bendahara',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      phone: '+6281234567893'
    },
    {
      id: '4',
      name: 'Dewi Anggraini',
      role: 'Koordinator Acara',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      phone: '+6281234567894'
    },
    {
      id: '5',
      name: 'Agus Setiawan',
      role: 'Koordinator Konsumsi',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      phone: '+6281234567895'
    },
    {
      id: '6',
      name: 'Rina Fitriani',
      role: 'Koordinator Dekorasi',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80',
      phone: '+6281234567896'
    }
  ],
  vendors: [
    {
      id: '1',
      name: 'Elegant Catering',
      category: 'Katering',
      contact: '+6281234567897',
      instagram: '@elegant_catering',
      website: 'www.elegantcatering.com',
      logo: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: '2',
      name: 'Floral Dreams',
      category: 'Dekorasi',
      contact: '+6281234567898',
      instagram: '@floral_dreams',
      website: 'www.floraldreams.com',
      logo: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: '3',
      name: 'Harmony Music',
      category: 'Musik',
      contact: '+6281234567899',
      instagram: '@harmony_music',
      website: 'www.harmonymusic.com',
      logo: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: '4',
      name: 'Capture Moments',
      category: 'Fotografi',
      contact: '+6281234567800',
      instagram: '@capture_moments',
      website: 'www.capturemoments.com',
      logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: '5',
      name: 'Sweet Delights',
      category: 'Kue',
      contact: '+6281234567801',
      instagram: '@sweet_delights',
      website: 'www.sweetdelights.com',
      logo: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80'
    },
    {
      id: '6',
      name: 'Elegant Attire',
      category: 'Busana',
      contact: '+6281234567802',
      instagram: '@elegant_attire',
      website: 'www.elegantattire.com',
      logo: 'https://images.unsplash.com/photo-1490707967831-1fd9b48e40e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    }
  ],
  coordinators: [
    {
      id: '1',
      name: 'Ahmad Fauzi',
      role: 'Koordinator Utama',
      phone: '+6281234567803',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: '2',
      name: 'Ratna Dewi',
      role: 'Koordinator Pemberkatan',
      phone: '+6281234567804',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80'
    },
    {
      id: '3',
      name: 'Budi Santoso',
      role: 'Koordinator Resepsi',
      phone: '+6281234567805',
      photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: '4',
      name: 'Siti Aminah',
      role: 'Koordinator Tamu',
      phone: '+6281234567806',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80'
    }
  ],
  moodboard: [
    {
      id: '1',
      categoryId: 'decoration',
      imageUrl: 'https://images.unsplash.com/photo-1519741347686-c1e331fcb4d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      description: 'Dekorasi dengan nuansa rustic dan sentuhan bunga segar',
      source: 'Pinterest'
    },
    {
      id: '2',
      categoryId: 'decoration',
      imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Rangkaian bunga untuk meja tamu dengan warna pastel',
      source: 'Instagram'
    },
    {
      id: '3',
      categoryId: 'cake',
      imageUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      description: 'Kue pernikahan tiga tingkat dengan hiasan bunga segar',
      source: 'Wedding Magazine'
    },
    {
      id: '4',
      categoryId: 'attire',
      imageUrl: 'https://images.unsplash.com/photo-1594552072238-5c4a26f10bfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      description: 'Gaun pengantin dengan model A-line dan detail bordir',
      source: 'Bridal Boutique'
    },
    {
      id: '5',
      categoryId: 'attire',
      imageUrl: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Setelan jas pengantin pria dengan warna navy blue',
      source: 'Men\'s Fashion'
    },
    {
      id: '6',
      categoryId: 'invitation',
      imageUrl: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      description: 'Desain undangan dengan tema rustic dan detail kaligrafi',
      source: 'Design Studio'
    }
  ],
  eventSummary: {
    place: 'Griya Joglo',
    eventType: 'Pemberkatan & Resepsi',
    ceremonyTime: '14.00 – 15.30',
    receptionTime: '15.30 – 18.00',
    ceremonyGuests: '100 Orang',
    ceremonyGuestsDetail: '(Keluarga Inti & Jemaat)',
    receptionGuests: '350 Orang',
    churchStaffSouvenir: '5 pcs (Nasi Kotak by Keluarga + Souvenir)',
    churchStaffNote: '*ada tambahan bingkisan sendiri',
    receptionSouvenir: '300 pcs (Gelas Tumbler)',
    receptionSouvenirNote: 'Kenang-kenangan spesial untuk para tamu yang hadir di hari bahagia kami'
  }
};

export const adminCredentials = {
  username: 'admin',
  password: 'wedding2023'
};