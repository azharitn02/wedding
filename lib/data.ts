export const weddingData = {
  prayer: {
    surah: "Ar-Rum [30:21]",
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    translation: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought."
  },
  couple: {
    bride: {
      name: "Strawberry",
      fullName: "Strawberry Fields Forever",
      parents: "Daughter of Mr. Berry & Mrs. Fruit",
      chibiColor: "bg-brand-burgundy",
      description: "A dreamer with a heart for the stars, finding music in the rustle of leaves."
    },
    groom: {
      name: "Blueberry",
      fullName: "Blueberry Hill Sky",
      parents: "Son of Mr. Blue & Mrs. Sky",
      chibiColor: "bg-brand-espresso",
      description: "The steady hand that guides her home, with a quiet strength and a kind soul."
    },
    story: "Two souls who found harmony in the simplest of moments. A journey that started with a shared umbrella and a quiet conversation in the park.",
    quote: "We were together. I forget the rest.",
    quoteAuthor: "Walt Whitman"
  },
  event: {
    names: "Strawberry & Blueberry",
    initials: "SB",
    invitationNo: "024",
    date: "September 24th, 2026",
    day: "Saturday",
    time: "4:00 PM",
    venue: "The Glass House",
    address: "123 Eden Gardens, Auckland Waterfront",
    city: "Auckland, New Zealand",
    location: "Auckland, New Zealand",
    googleMapsUrl: "https://maps.google.com/maps?q=The+Glass+House+Auckland",
    attire: "Black Tie",
    attireSub: "Elegance requested",
    rsvpDeadline: "August 1st, 2026",
    giftNote: "Your presence is the greatest gift we could ask for. Should you wish to contribute to our future together, a contribution to our honeymoon fund would be deeply appreciated."
  },
  journey: [
    { year: "2018", title: "The First Hello", description: "Coffee shop sketches and shared playlists." },
    { year: "2020", title: "The Long Road", description: "A quiet hike that turned into a life-long journey." },
    { year: "2023", title: "The Question", description: "A snowy evening in the park, and a whispered 'Yes'." }
  ],
  memories: [
    { id: 1, title: "Our First Home", color: "bg-brand-mauve/20", description: "Capturing the moments that defined our love story, frame by frame." },
    { id: 2, title: "Summer Travels", color: "bg-brand-burgundy/10", description: "Sun-drenched afternoons and endless roads." },
    { id: 3, title: "Rainy Afternoons", color: "bg-brand-espresso/5", description: "Books, tea, and the rhythm of falling rain." },
    { id: 4, title: "Golden Hour", color: "bg-brand-beige/40", description: "Watching the sun dip below the horizon, together." }
  ]
};

export type WeddingData = typeof weddingData;
