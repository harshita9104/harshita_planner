export const activityCategories = {
  culinary: {
    name: 'Culinary Experiences',
    icon: 'ChefHat',
    color: 'bg-gradient-to-r from-orange-500 to-red-500',
    activities: [
      { 
        id: 'gourmet-brunch', 
        name: 'Artisan Brunch Experience', 
        duration: 120, 
        vibe: 'sophisticated', 
        time: '10:30', 
        icon: 'Coffee',
        description: 'Indulge in a carefully crafted brunch with locally sourced ingredients',
        energyLevel: 'low',
        category: 'Indoor'
      },
      { 
        id: 'collaborative-cooking', 
        name: 'Collaborative Cooking Session', 
        duration: 150, 
        vibe: 'creative', 
        time: '17:30', 
        icon: 'Utensils',
        description: 'Team up to create culinary masterpieces together',
        energyLevel: 'medium',
        category: 'Indoor'
      },
      { 
        id: 'wine-discovery', 
        name: 'Wine & Cheese Discovery', 
        duration: 180, 
        vibe: 'refined', 
        time: '16:00', 
        icon: 'Wine',
        description: 'Explore exquisite wine and cheese pairings',
        energyLevel: 'low',
        category: 'Indoor'
      },
      { 
        id: 'street-food-adventure', 
        name: 'Street Food Expedition', 
        duration: 90, 
        vibe: 'adventurous', 
        time: '12:30', 
        icon: 'ShoppingCart',
        description: 'Discover hidden culinary gems around the city',
        energyLevel: 'medium',
        category: 'Outdoor'
      },
      { 
        id: 'farmers-market', 
        name: 'Farmers Market Tour', 
        duration: 120, 
        vibe: 'authentic', 
        time: '09:00', 
        icon: 'Apple',
        description: 'Source fresh ingredients and connect with local producers',
        energyLevel: 'medium',
        category: 'Outdoor'
      }
    ]
  },
  adventure: {
    name: 'Outdoor Expeditions',
    icon: 'Compass',
    color: 'bg-gradient-to-r from-green-500 to-teal-600',
    activities: [
      { 
        id: 'mountain-expedition', 
        name: 'Mountain Trail Expedition', 
        duration: 300, 
        vibe: 'challenging', 
        time: '07:30', 
        icon: 'Mountain',
        description: 'Conquer scenic trails and discover breathtaking vistas',
        energyLevel: 'high',
        category: 'Outdoor'
      },
      { 
        id: 'botanical-picnic', 
        name: 'Botanical Garden Picnic', 
        duration: 180, 
        vibe: 'serene', 
        time: '12:00', 
        icon: 'TreePine',
        description: 'Relax among beautiful flora with a gourmet picnic',
        energyLevel: 'low',
        category: 'Outdoor'
      },
      { 
        id: 'urban-cycling', 
        name: 'Urban Cycling Tour', 
        duration: 150, 
        vibe: 'dynamic', 
        time: '09:30', 
        icon: 'Bike',
        description: 'Explore the city\'s hidden corners on two wheels',
        energyLevel: 'high',
        category: 'Outdoor'
      },
      { 
        id: 'astronomy-night', 
        name: 'Astronomical Observatory', 
        duration: 180, 
        vibe: 'mystical', 
        time: '21:30', 
        icon: 'Star',
        description: 'Gaze at celestial wonders and learn about the cosmos',
        energyLevel: 'low',
        category: 'Outdoor'
      },
      { 
        id: 'photography-walk', 
        name: 'Photography Expedition', 
        duration: 200, 
        vibe: 'artistic', 
        time: '08:00', 
        icon: 'Camera',
        description: 'Capture stunning moments and improve your photography skills',
        energyLevel: 'medium',
        category: 'Outdoor'
      }
    ]
  },
  cultural: {
    name: 'Cultural Immersion',
    icon: 'Palette',
    color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    activities: [
      { 
        id: 'cinema-experience', 
        name: 'Independent Cinema Experience', 
        duration: 200, 
        vibe: 'thoughtful', 
        time: '19:30', 
        icon: 'Film',
        description: 'Discover thought-provoking films and engage in discussions',
        energyLevel: 'low',
        category: 'Indoor'
      },
      { 
        id: 'live-performance', 
        name: 'Live Musical Performance', 
        duration: 180, 
        vibe: 'electrifying', 
        time: '20:30', 
        icon: 'Music',
        description: 'Experience the energy of live music in intimate venues',
        energyLevel: 'medium',
        category: 'Indoor'
      },
      { 
        id: 'gallery-exploration', 
        name: 'Contemporary Art Gallery', 
        duration: 150, 
        vibe: 'inspiring', 
        time: '14:30', 
        icon: 'Palette',
        description: 'Explore contemporary art and expand your creative horizons',
        energyLevel: 'low',
        category: 'Indoor'
      },
      { 
        id: 'board-game-tournament', 
        name: 'Strategy Game Tournament', 
        duration: 240, 
        vibe: 'competitive', 
        time: '19:00', 
        icon: 'Gamepad2',
        description: 'Challenge friends in strategic thinking and friendly competition',
        energyLevel: 'low',
        category: 'Indoor'
      },
      { 
        id: 'cultural-workshop', 
        name: 'Cultural Arts Workshop', 
        duration: 180, 
        vibe: 'creative', 
        time: '15:00', 
        icon: 'Brush',
        description: 'Learn traditional crafts and express your creativity',
        energyLevel: 'medium',
        category: 'Indoor'
      }
    ]
  },
  mindfulness: {
    name: 'Mindful Living',
    icon: 'Heart',
    color: 'bg-gradient-to-r from-pink-500 to-rose-500',
    activities: [
      { 
        id: 'holistic-spa', 
        name: 'Holistic Spa Retreat', 
        duration: 300, 
        vibe: 'rejuvenating', 
        time: '10:00', 
        icon: 'Sparkles',
        description: 'Immerse yourself in complete relaxation and rejuvenation',
        energyLevel: 'low',
        category: 'Indoor'
      },
      { 
        id: 'sunrise-yoga', 
        name: 'Sunrise Yoga Session', 
        duration: 90, 
        vibe: 'energizing', 
        time: '06:30', 
        icon: 'Sunrise',
        description: 'Start your day with mindful movement and breath work',
        energyLevel: 'medium',
        category: 'Outdoor'
      },
      { 
        id: 'mindfulness-retreat', 
        name: 'Mindfulness Meditation Retreat', 
        duration: 120, 
        vibe: 'centering', 
        time: '08:00', 
        icon: 'Brain',
        description: 'Cultivate inner peace and mental clarity through guided meditation',
        energyLevel: 'low',
        category: 'Indoor'
      },
      { 
        id: 'literary-journey', 
        name: 'Literary Exploration', 
        duration: 180, 
        vibe: 'contemplative', 
        time: '15:30', 
        icon: 'BookOpen',
        description: 'Dive into captivating stories and expand your literary horizons',
        energyLevel: 'low',
        category: 'Indoor'
      },
      { 
        id: 'digital-detox', 
        name: 'Digital Detox Experience', 
        duration: 240, 
        vibe: 'liberating', 
        time: '11:00', 
        icon: 'Smartphone',
        description: 'Disconnect from technology and reconnect with yourself',
        energyLevel: 'low',
        category: 'Outdoor'
      }
    ]
  },
  social: {
    name: 'Social Connections',
    icon: 'Users',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    activities: [
      { 
        id: 'community-volunteering', 
        name: 'Community Volunteering', 
        duration: 240, 
        vibe: 'meaningful', 
        time: '09:00', 
        icon: 'Heart',
        description: 'Give back to your community and make a positive impact',
        energyLevel: 'medium',
        category: 'Outdoor'
      },
      { 
        id: 'trivia-championship', 
        name: 'Trivia Championship', 
        duration: 150, 
        vibe: 'competitive', 
        time: '20:00', 
        icon: 'Trophy',
        description: 'Test your knowledge and compete in friendly trivia battles',
        energyLevel: 'medium',
        category: 'Indoor'
      },
      { 
        id: 'dance-workshop', 
        name: 'Dance Workshop', 
        duration: 120, 
        vibe: 'expressive', 
        time: '18:00', 
        icon: 'Music2',
        description: 'Learn new dance moves and express yourself through movement',
        energyLevel: 'high',
        category: 'Indoor'
      },
      { 
        id: 'networking-meetup', 
        name: 'Creative Networking Meetup', 
        duration: 180, 
        vibe: 'inspiring', 
        time: '17:00', 
        icon: 'Users',
        description: 'Connect with like-minded individuals and expand your network',
        energyLevel: 'medium',
        category: 'Indoor'
      }
    ]
  }
};

export const themes = {
  mindfulEscape: { 
    name: 'Mindful Escape', 
    color: 'bg-gradient-to-r from-emerald-400 to-teal-500', 
    icon: 'Leaf', 
    activities: ['mindfulness-retreat', 'holistic-spa', 'botanical-picnic', 'literary-journey'],
    description: 'Disconnect from stress and reconnect with inner peace',
    mood: 'serene'
  },
  urbanExplorer: { 
    name: 'Urban Explorer', 
    color: 'bg-gradient-to-r from-orange-500 to-red-500', 
    icon: 'MapPin', 
    activities: ['street-food-adventure', 'urban-cycling', 'photography-walk', 'gallery-exploration'],
    description: 'Discover hidden gems and vibrant city culture',
    mood: 'adventurous'
  },
  creativeSoul: { 
    name: 'Creative Soul', 
    color: 'bg-gradient-to-r from-purple-500 to-pink-500', 
    icon: 'Sparkles', 
    activities: ['cultural-workshop', 'live-performance', 'collaborative-cooking', 'cinema-experience'],
    description: 'Express yourself through art, music, and creativity',
    mood: 'inspiring'
  },
  socialButterfly: { 
    name: 'Social Butterfly', 
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600', 
    icon: 'Users2', 
    activities: ['networking-meetup', 'dance-workshop', 'trivia-championship', 'farmers-market'],
    description: 'Connect with others and build meaningful relationships',
    mood: 'energetic'
  },
  wellnessWarrior: { 
    name: 'Wellness Warrior', 
    color: 'bg-gradient-to-r from-green-400 to-blue-500', 
    icon: 'Shield', 
    activities: ['sunrise-yoga', 'mountain-expedition', 'digital-detox', 'gourmet-brunch'],
    description: 'Prioritize your health and well-being',
    mood: 'balanced'
  },
  luxurySeeker: { 
    name: 'Luxury Seeker', 
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500', 
    icon: 'Crown', 
    activities: ['wine-discovery', 'holistic-spa', 'astronomy-night', 'independent-cinema'],
    description: 'Indulge in premium experiences and refined pleasures',
    mood: 'sophisticated'
  }
};

export const weekendOptions = {
  twoDays: { name: 'Default', days: ['saturday', 'sunday'] },
  threeDaysFriday: { name: '3-Day (Fri-Sun)', days: ['friday', 'saturday', 'sunday'] },
  threeDaysMonday: { name: '3-Day (Sat-Mon)', days: ['saturday', 'sunday', 'monday'] },
  fourDaysThursday: { name: '4-Day (Thu-Sun)', days: ['thursday', 'friday', 'saturday', 'sunday'] },
  fourDaysMonday: { name: '4-Day (Fri-Mon)', days: ['friday', 'saturday', 'sunday', 'monday'] },
  fourDaysTuesday: { name: '4-Day (Sat-Tue)', days: ['saturday', 'sunday', 'monday', 'tuesday'] }
};
