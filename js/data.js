/**
 * AuraFest Celebration & Event Planner - Default Event Data
 * High-fidelity presets for Weddings, Milestone Birthdays, and Community Events.
 */

export const DEFAULT_EVENTS = [
  {
    id: 'evt-wedding-01',
    type: 'wedding',
    title: 'Elena & Marcus: Coastal Vineyard Wedding',
    tagline: 'An intimate sunset celebration of love amidst rolling hills and olive groves.',
    date: '2026-11-14',
    time: '15:30',
    location: 'St. Helena Estate & Vineyard, Napa Valley, CA',
    guestsTarget: 140,
    budgetTotal: 48000,
    currency: '$',
    coverImage: 'assets/images/wedding_cover.jpg',
    theme: {
      name: 'Tuscan Sunset & White Flora',
      description: 'Earthy terracotta, warm champagne gold, olive branch greenery, and crisp white garden roses.',
      palette: [
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Tuscan Olive', hex: '#556B2F' },
        { name: 'Warm Terracotta', hex: '#C86D51' },
        { name: 'Crisp Alabaster', hex: '#F9F6F0' },
        { name: 'Midnight Espresso', hex: '#2C221E' }
      ],
      dressCode: 'Black-Tie Optional / Warm Autumn Elegance',
      signatureDrinks: [
        { name: 'Vineyard Spritz', ingredients: 'Sparkling Prosecco, elderflower liqueur, fresh rosemary sprig, white peach purée' },
        { name: 'Smoky Oak Old Fashioned', ingredients: 'Bourbon, maple bitters, smoked orange peel, brandied cherry' }
      ],
      playlistVibes: 'Acoustic indie folk prelude, acoustic strings ceremony, modern bossa nova cocktail hour, high-energy 90s/00s live brass party band'
    },
    budget: {
      categories: [
        { id: 'cat-venue', name: 'Venue & Rentals', allocated: 15500, spent: 15000 },
        { id: 'cat-catering', name: 'Catering & Open Bar', allocated: 16000, spent: 14800 },
        { id: 'cat-photo', name: 'Photography & Cinema', allocated: 5500, spent: 5500 },
        { id: 'cat-florals', name: 'Florals & Decor', allocated: 4200, spent: 3900 },
        { id: 'cat-music', name: 'DJ & Live Strings', allocated: 3000, spent: 2800 },
        { id: 'cat-attire', name: 'Attire & Beauty', allocated: 2200, spent: 2100 },
        { id: 'cat-buffer', name: 'Contingency Buffer', allocated: 1600, spent: 400 }
      ],
      items: [
        { id: 'b-1', category: 'Venue & Rentals', title: 'St. Helena Vineyard Estate Rental Fee', estimated: 12000, actual: 12000, status: 'Paid', vendor: 'St. Helena Estate', dueDate: '2026-08-01' },
        { id: 'b-2', category: 'Venue & Rentals', title: 'Farmhouse Dining Tables & Cross-Back Chairs', estimated: 3500, actual: 3000, status: 'Deposit Paid', vendor: 'Napa Valley Event Rentals', dueDate: '2026-10-15' },
        { id: 'b-3', category: 'Catering & Open Bar', title: 'Plated 3-Course Farm-to-Table Dinner (140 pax)', estimated: 12500, actual: 11800, status: 'Deposit Paid', vendor: 'Artisan Kitchen Catering', dueDate: '2026-10-30' },
        { id: 'b-4', category: 'Catering & Open Bar', title: 'Full Bar Package & Sommelier Selection', estimated: 3500, actual: 3000, status: 'Pending', vendor: 'Artisan Kitchen Catering', dueDate: '2026-11-01' },
        { id: 'b-5', category: 'Photography & Cinema', title: 'Full Day Coverage + 4K Drone + Second Shooter', estimated: 5500, actual: 5500, status: 'Deposit Paid', vendor: 'Lumina Storytellers', dueDate: '2026-11-14' },
        { id: 'b-6', category: 'Florals & Decor', title: 'Arch Installation, Floral Centerpieces & Bouquets', estimated: 4200, actual: 3900, status: 'Deposit Paid', vendor: 'Flora & Wild Studio', dueDate: '2026-11-05' },
        { id: 'b-7', category: 'DJ & Live Strings', title: 'Acoustic String Duo + Reception Live Band DJ', estimated: 3000, actual: 2800, status: 'Deposit Paid', vendor: 'Golden Gate Grooves', dueDate: '2026-11-10' },
        { id: 'b-8', category: 'Contingency Buffer', title: 'Heater rentals for outdoor terrace', estimated: 800, actual: 400, status: 'Paid', vendor: 'Napa Valley Event Rentals', dueDate: '2026-10-20' }
      ]
    },
    timeline: {
      preEvent: [
        { id: 't-pre-1', phase: '6-8 Months Out', task: 'Book ceremony & reception venue and lock in date', completed: true, owner: 'Marcus & Elena' },
        { id: 't-pre-2', phase: '4-6 Months Out', task: 'Reserve lead photographer, videographer, and floral designer', completed: true, owner: 'Elena' },
        { id: 't-pre-3', phase: '3 Months Out', task: 'Send out formal printed & digital invitations with RSVP link', completed: true, owner: 'Marcus' },
        { id: 't-pre-4', phase: '1 Month Out', task: 'Finalize seating chart, meal selections, and order signage', completed: false, owner: 'Elena' },
        { id: 't-pre-5', phase: '1 Week Out', task: 'Confirm final guest headcount and run-of-show with all vendors', completed: false, owner: 'Marcus' },
        { id: 't-pre-6', phase: 'Day Before', task: 'Rehearsal dinner & walk-through with wedding party and officiant', completed: false, owner: 'Wedding Party' }
      ],
      dayOf: [
        { id: 't-day-1', time: '09:00', title: 'Bridal Suite Hair & Makeup Starts', location: 'Estate Bridal Villa', lead: 'Glam By Chloe', notes: 'Mimosas, fruit skewers, chill acoustic playlist' },
        { id: 't-day-2', time: '11:30', title: 'Groomsmen Suite Gathering & Groom Prep', location: 'Vineyard Cottage', lead: 'Best Man David', notes: 'Catered sandwiches, steam suits, cufflink check' },
        { id: 't-day-3', time: '12:00', title: 'Vendor Load-In & Floral Arch Setup', location: 'Ceremony Lawn & Dining Arbor', lead: 'Flora & Wild / Planner', notes: 'Verify power drops for band and sound check' },
        { id: 't-day-4', time: '14:30', title: 'First Look & Couple Portraits', location: 'Olive Grove Pathway', lead: 'Lumina Storytellers', notes: 'Private moment, drone establishing shots' },
        { id: 't-day-5', time: '15:15', title: 'Wedding Party & Family Portraits', location: 'Vineyard Vista Steps', lead: 'Lumina Storytellers', notes: 'Immediate family list checked off in order' },
        { id: 't-day-6', time: '15:45', title: 'Guest Arrival & Welcome Refreshments', location: 'Courtyard Pergola', lead: 'Catering Staff', notes: 'Sparkling cider, infused citrus water, acoustic string duo' },
        { id: 't-day-7', time: '16:15', title: 'Ceremony Processional Begins', location: 'Sunset Oak Lawn', lead: 'Officiant Sarah Lin', notes: 'Vows exchange, ring ceremony, joyful recessional' },
        { id: 't-day-8', time: '17:00', title: 'Cocktail Hour & Passed Hors d’Oeuvres', location: 'Terra Cotta Terrace', lead: 'Artisan Kitchen Catering', notes: 'Signature Spritz served, oyster shucking station' },
        { id: 't-day-9', time: '18:15', title: 'Grand Entrance & Welcome Toasts', location: 'Under the Fairy Lights Pavilion', lead: 'MC / Band Leader', notes: 'Parents of the bride & groom toasts' },
        { id: 't-day-10', time: '18:45', title: 'Plated Dinner & Wine Pairing', location: 'Pavilion Banquet Tables', lead: 'Artisan Kitchen Catering', notes: 'Roasted Chilean sea bass or braised beef short rib' },
        { id: 't-day-11', time: '20:00', title: 'First Dance & Cake Cutting', location: 'Dance Terrace', lead: 'DJ & Band', notes: 'Song: "Beyond" by Leon Bridges, sparkler moment' },
        { id: 't-day-12', time: '20:30', title: 'Dancefloor Opens & Open Bar', location: 'Dance Terrace', lead: 'Golden Gate Grooves', notes: 'High-energy brass set, glow favors distributed' },
        { id: 't-day-13', time: '22:45', title: 'Sparkler Grand Exit & Shuttles', location: 'Main Estate Gates', lead: 'Wedding Coordinator', notes: 'Safe shuttle buses departing to downtown Napa hotels' }
      ]
    },
    vendors: [
      { id: 'v-1', category: 'Venue', name: 'St. Helena Estate & Vineyard', contact: 'Claire Vance (Events Director)', phone: '(707) 555-8921', email: 'events@sthelenaestate.com', status: 'Booked', cost: 12000, notes: 'Includes ceremony lawn, fairy-light arbor, bridal suite, and parking coordinator.' },
      { id: 'v-2', category: 'Catering', name: 'Artisan Kitchen Catering Co.', contact: 'Chef Henri Moreau', phone: '(415) 555-3419', email: 'henri@artisankitchen.com', status: 'Booked', cost: 14800, notes: 'Full organic farm-to-table dinner, passed appetizers, open craft bar, certified bartenders.' },
      { id: 'v-3', category: 'Photography', name: 'Lumina Storytellers Cinema', contact: 'Kaelen Ross', phone: '(415) 555-9012', email: 'kaelen@luminastorytellers.com', status: 'Booked', cost: 5500, notes: 'Includes 10 hours coverage, 2 photographers, 1 drone videographer, raw footage + 8min highlight film.' },
      { id: 'v-4', category: 'Florist', name: 'Flora & Wild Floral Design', contact: 'Sienna Brooks', phone: '(707) 555-2244', email: 'hello@florawild.com', status: 'Booked', cost: 3900, notes: 'White garden roses, eucalyptus, olive branches, custom copper arch floral pillars.' },
      { id: 'v-5', category: 'Music & DJ', name: 'Golden Gate Grooves Entertainment', contact: 'DJ Dex & Live Sax', phone: '(415) 555-7761', email: 'dex@gggrooves.com', status: 'Booked', cost: 2800, notes: 'Ceremony PA system, wireless mics, cocktail acoustic duo, 6-piece live funk brass + DJ fusion.' },
      { id: 'v-6', category: 'Bakery', name: 'Petite Sweet Patisserie', contact: 'Nathalie Dupont', phone: '(707) 555-4411', email: 'order@petitesweet.com', status: 'Contacted', cost: 750, notes: '3-tier naked cake with lavender lemon curd and fresh figs.' }
    ],
    checklists: [
      { id: 'c-1', category: 'Paperwork & Legal', task: 'Obtain California Marriage License from County Clerk', completed: true, priority: 'High', due: '2026-10-25' },
      { id: 'c-2', category: 'Catering', task: 'Finalize menu tasting & dietary restriction counts (GF, Vegan, Nut-free)', completed: true, priority: 'High', due: '2026-10-10' },
      { id: 'c-3', category: 'Decor', task: 'Finalize seating chart board, table numbers, and place cards', completed: false, priority: 'Medium', due: '2026-11-01' },
      { id: 'c-4', category: 'Music', task: 'Submit "Must Play" and "Do Not Play" playlist to DJ Dex', completed: false, priority: 'Medium', due: '2026-11-05' },
      { id: 'c-5', category: 'Logistics', task: 'Confirm guest shuttle departure schedule with Napa Transit Lines', completed: false, priority: 'High', due: '2026-11-08' },
      { id: 'c-6', category: 'Personal', task: 'Pack day-of emergency kit (fashion tape, stain remover, mints, safety pins)', completed: false, priority: 'Low', due: '2026-11-12' },
      { id: 'c-7', category: 'Payments', task: 'Prepare vendor tip envelopes in labeled pouches for wedding coordinator', completed: false, priority: 'High', due: '2026-11-13' }
    ],
    guests: [
      { id: 'g-1', name: 'Sophia & Liam Vance', email: 'sophia.vance@email.com', rsvp: 'Attending', count: 2, dietary: 'None', table: 'Table 1 - Family' },
      { id: 'g-2', name: 'Dr. Arthur Pendelton', email: 'dr.pendelton@hospital.org', rsvp: 'Attending', count: 1, dietary: 'Vegetarian', table: 'Table 2 - College Friends' },
      { id: 'g-3', name: 'Maya Lin & Partner', email: 'maya.lin@studio.com', rsvp: 'Attending', count: 2, dietary: 'Gluten-Free', table: 'Table 3 - Art Collective' },
      { id: 'g-4', name: 'Julian & Mateo Gomez', email: 'mateo.gomez@techfirm.io', rsvp: 'Attending', count: 2, dietary: 'Vegan', table: 'Table 2 - College Friends' },
      { id: 'g-5', name: 'Charlotte Dubois', email: 'charlotte.d@paris.fr', rsvp: 'Declined', count: 1, dietary: 'None', table: 'Unassigned' },
      { id: 'g-6', name: 'Devon & Priya Patel', email: 'devon.patel@consulting.com', rsvp: 'Attending', count: 2, dietary: 'Halal', table: 'Table 4 - West Coast Crew' },
      { id: 'g-7', name: 'Zachary Ross', email: 'zross@creative.co', rsvp: 'Pending', count: 1, dietary: 'Nut Allergy', table: 'Table 3 - Art Collective' }
    ]
  },
  {
    id: 'evt-bday-02',
    type: 'birthday',
    title: "Leo's 30th: Neon Retro Arcade Rooftop Gala",
    tagline: 'A futuristic cyber-lounge celebration with vintage synthesizers, artisan cocktails, and rooftop skyline views.',
    date: '2026-12-05',
    time: '19:30',
    location: 'The Glass Horizon Loft & Terrace, DUMBO, Brooklyn, NY',
    guestsTarget: 60,
    budgetTotal: 7500,
    currency: '$',
    coverImage: 'assets/images/birthday_cover.jpg',
    theme: {
      name: 'Midnight Cyberpunk & Golden Glow',
      description: 'Electric violet neon, warm amber champagne, chrome accents, and deep obsidian black.',
      palette: [
        { name: 'Neon Violet', hex: '#8B5CF6' },
        { name: 'Electric Cyan', hex: '#06B6D4' },
        { name: 'Golden Amber', hex: '#F59E0B' },
        { name: 'Obsidian Velvet', hex: '#0F172A' },
        { name: 'Pure Platinum', hex: '#E2E8F0' }
      ],
      dressCode: 'Sleek Chic / Futuristic Glamour (Velvet, Leather, Metallics)',
      signatureDrinks: [
        { name: 'The Cyber-Glow Mule', ingredients: 'Vodka, blue curaçao, ginger beer, lime juice, glowing LED ice cube' },
        { name: 'Synthwave Old Fashioned', ingredients: 'Rye whiskey, smoked cherry reduction, bitters, 24k edible gold flakes' }
      ],
      playlistVibes: 'French house, Daft Punk disco edits, synthwave, 80s electro-pop, UK garage grooves'
    },
    budget: {
      categories: [
        { id: 'cat-venue', name: 'Rooftop Loft Rental', allocated: 2600, spent: 2500 },
        { id: 'cat-bar', name: 'Craft Mixology & Drinks', allocated: 1800, spent: 1700 },
        { id: 'cat-bites', name: 'Gourmet Tapas & Sliders', allocated: 1400, spent: 1350 },
        { id: 'cat-dj', name: 'Sound System & DJ Deck', allocated: 800, spent: 750 },
        { id: 'cat-decor', name: 'Neon Art & Photo Booth', allocated: 600, spent: 580 },
        { id: 'cat-buffer', name: 'Emergency Contingency', allocated: 300, spent: 100 }
      ],
      items: [
        { id: 'b-b1', category: 'Rooftop Loft Rental', title: 'Glass Horizon Loft Private Booking (6 hrs)', estimated: 2500, actual: 2500, status: 'Paid', vendor: 'Brooklyn Loft Collective', dueDate: '2026-11-01' },
        { id: 'b-b2', category: 'Craft Mixology & Drinks', title: 'Dedicated Mixologist + Custom Neon Cocktail Bar', estimated: 1800, actual: 1700, status: 'Deposit Paid', vendor: 'Liquid Art Mixology', dueDate: '2026-11-20' },
        { id: 'b-b3', category: 'Gourmet Tapas & Sliders', title: 'Passed wagyu sliders, bao buns, and truffle fries', estimated: 1400, actual: 1350, status: 'Deposit Paid', vendor: 'Gotham Street Bites', dueDate: '2026-11-25' },
        { id: 'b-b4', category: 'Sound System & DJ Deck', title: 'Pioneer DJ Decks, Subwoofers & Laser Package', estimated: 800, actual: 750, status: 'Pending', vendor: 'East River Sound & Light', dueDate: '2026-12-01' },
        { id: 'b-b5', category: 'Neon Art & Photo Booth', title: 'Custom "LEO 30" Neon Sign & 360 Spin Cam', estimated: 600, actual: 580, status: 'Paid', vendor: 'NeonVibe NYC', dueDate: '2026-11-15' }
      ]
    },
    timeline: {
      preEvent: [
        { id: 't-bpre-1', phase: '4 Weeks Out', task: 'Lock in rooftop venue deposit & security paperwork', completed: true, owner: 'Leo' },
        { id: 't-bpre-2', phase: '3 Weeks Out', task: 'Order custom neon sign and confirm mixologist menu', completed: true, owner: 'Leo' },
        { id: 't-bpre-3', phase: '2 Weeks Out', task: 'Curate party playlist and coordinate DJ handoff', completed: false, owner: 'Sam (Friend)' },
        { id: 't-bpre-4', phase: '3 Days Out', task: 'Send rooftop entry access codes to all confirmed guests', completed: false, owner: 'Leo' }
      ],
      dayOf: [
        { id: 't-bday-1', time: '17:00', title: 'Host & Crew Access Loft for Decor Setup', location: 'Glass Horizon 7th Floor', lead: 'Leo & Setup Squad', notes: 'Hang neon sign, set up retro arcade cabinets, ambient lights' },
        { id: 't-bday-2', time: '18:15', title: 'Mixology Bar Stock & Ice Delivery', location: 'Main Terrace Bar', lead: 'Liquid Art Mixology', notes: 'Chill champagne, prep craft syrups and garnishes' },
        { id: 't-bday-3', time: '19:30', title: 'Doors Open & Welcome Signature Cocktails', location: 'Indoor Lounge & Terrace', lead: 'Welcome Greeter', notes: 'Chill French house grooves, skyline photography' },
        { id: 't-bday-4', time: '20:30', title: 'Passed Hot Bites & Retro Arcade Tournament', location: 'Gaming Nook', lead: 'Host MC', notes: 'Street Fighter II & Mario Kart bracket on big projector' },
        { id: 't-bday-5', time: '21:45', title: 'The 30th Birthday Champagne Toast & Cake Reveal', location: 'Center Terrace Lounge', lead: 'Best Friends Crew', notes: 'Geometric mirror glaze cake with sparkler candles' },
        { id: 't-day-6', time: '22:15', title: 'Full DJ Dance Set & Skyline Lights', location: 'Main Loft Dancefloor', lead: 'DJ K-Vibe', notes: 'High BPM dance music, fog machine subtle bursts' },
        { id: 't-bday-7', time: '01:30', title: 'Last Call & Midnight Pizza Drop', location: 'Terrace Bar', lead: 'Joe’s Pizza Delivery', notes: 'Warm pizza slices for lingering night owls' }
      ]
    },
    vendors: [
      { id: 'v-b1', category: 'Venue', name: 'Glass Horizon Loft DUMBO', contact: 'Marcus Bell', phone: '(212) 555-1980', email: 'marcus@glasshorizon.nyc', status: 'Booked', cost: 2500, notes: 'Panoramic Manhattan skyline view, indoor lounge + heated glass terrace.' },
      { id: 'v-b2', category: 'Beverage', name: 'Liquid Art NYC Mixology', contact: 'Zoe Thorne', phone: '(917) 555-3277', email: 'zoe@liquidartnyc.com', status: 'Booked', cost: 1700, notes: 'Custom LED glow bar, 2 bartenders, 4 curated craft cocktail recipes.' },
      { id: 'v-b3', category: 'Catering', name: 'Gotham Street Bites Catering', contact: 'Chef Liam Cruz', phone: '(347) 555-8820', email: 'tapas@gothambites.com', status: 'Booked', cost: 1350, notes: 'Crispy pork belly bao, truffle parmesan sliders, vegan mushroom empanadas.' },
      { id: 'v-b4', category: 'Decor', name: 'NeonVibe NYC Custom Rentals', contact: 'Alicia Chen', phone: '(212) 555-6612', email: 'alicia@neonvibeny.com', status: 'Booked', cost: 580, notes: 'Delivered and mounted "LEO 30" dual-color LED neon sign.' }
    ],
    checklists: [
      { id: 'cb-1', category: 'Audio/Visual', task: 'Test HDMI connection for projector and arcade console setup', completed: true, priority: 'High', due: '2026-12-04' },
      { id: 'cb-2', category: 'Guest Ops', task: 'Provide doorman guest list for seamless elevator security entry', completed: false, priority: 'High', due: '2026-12-05' },
      { id: 'cb-3', category: 'Dessert', task: 'Pick up customized obsidian chocolate mirror cake from Brooklyn Patisserie', completed: false, priority: 'Medium', due: '2026-12-05' },
      { id: 'cb-4', category: 'Photography', task: 'Ensure portable camera batteries are charged for instant photo guestbook', completed: false, priority: 'Low', due: '2026-12-04' }
    ],
    guests: [
      { id: 'gb-1', name: 'Samira Khan', email: 'samira@design.org', rsvp: 'Attending', count: 1, dietary: 'Vegetarian', table: 'Lounge Zone A' },
      { id: 'gb-2', name: 'Dave & Chloe Miller', email: 'chloe.miller@media.com', rsvp: 'Attending', count: 2, dietary: 'None', table: 'Lounge Zone B' },
      { id: 'gb-3', name: 'Kenji Sato', email: 'kenji.sato@soundlab.io', rsvp: 'Attending', count: 1, dietary: 'Pescatarian', table: 'Lounge Zone A' },
      { id: 'gb-4', name: 'Tasha Williams', email: 'twilliams@lawfirm.com', rsvp: 'Attending', count: 1, dietary: 'Gluten-Free', table: 'Lounge Zone B' },
      { id: 'gb-5', name: 'Oliver Sterling', email: 'oliver.sterling@tech.co', rsvp: 'Pending', count: 1, dietary: 'None', table: 'Unassigned' }
    ]
  },
  {
    id: 'evt-community-03',
    type: 'community',
    title: 'Oakridge Twilight Lantern & Food Truck Festival',
    tagline: 'An open-air evening of world cuisine, acoustic performances, floating lantern workshops, and civic togetherness.',
    date: '2027-07-18',
    time: '16:00',
    location: 'Oakridge Civic Park & Lakefront Amphitheater, Oakridge, WA',
    guestsTarget: 1200,
    budgetTotal: 18500,
    currency: '$',
    coverImage: 'assets/images/festival_cover.jpg',
    theme: {
      name: 'Enchanted Forest & Paper Lanterns',
      description: 'Warm bioluminescent amber, festival teal, vibrant marigold, and forest evergreen.',
      palette: [
        { name: 'Warm Amber Glow', hex: '#F59E0B' },
        { name: 'Festival Teal', hex: '#0D9488' },
        { name: 'Marigold Blossom', hex: '#E11D48' },
        { name: 'Deep Forest', hex: '#064E3B' },
        { name: 'Paper White', hex: '#FEF3C7' }
      ],
      dressCode: 'Casual Outdoor Fest / Festive Summer Layers',
      signatureDrinks: [
        { name: 'Oakridge Honey Lavender Lemonade (Non-Alcoholic)', ingredients: 'Wildflower local honey, dried culinary lavender, fresh Meyer lemons, sparkling soda' },
        { name: 'Cascade Craft Cider Tasting Flight', ingredients: 'Local crisp apple cider, blackberry dry hop, spiced peach draft' }
      ],
      playlistVibes: 'Live indie acoustic songwriters, community youth orchestra ensemble, bluegrass band, twilight brass march'
    },
    budget: {
      categories: [
        { id: 'cat-permits', name: 'City Permits, Police & Security', allocated: 4500, spent: 4200 },
        { id: 'cat-stage', name: 'Stage, Sound & Generator Power', allocated: 4800, spent: 4600 },
        { id: 'cat-sanitation', name: 'Restrooms & Zero-Waste Recycling', allocated: 2500, spent: 2400 },
        { id: 'cat-lanterns', name: 'Lantern Supplies & Craft Tents', allocated: 3200, spent: 3000 },
        { id: 'cat-marketing', name: 'Signage, Posters & Community PR', allocated: 1500, spent: 1300 },
        { id: 'cat-firstaid', name: 'First Aid EMT & Emergency Buffer', allocated: 2000, spent: 1100 }
      ],
      items: [
        { id: 'b-c1', category: 'City Permits, Police & Security', title: 'City Park Special Event Permit & Park Ranger Fee', estimated: 2500, actual: 2400, status: 'Paid', vendor: 'City Parks & Rec Dept', dueDate: '2027-03-01' },
        { id: 'b-c2', category: 'City Permits, Police & Security', title: 'Oakridge Off-Duty Police Traffic Control Detail', estimated: 2000, actual: 1800, status: 'Pending', vendor: 'Oakridge Police Association', dueDate: '2027-06-15' },
        { id: 'b-c3', category: 'Stage, Sound & Generator Power', title: 'Covered Stage Trailer, PA System, & Sound Engineer', estimated: 3800, actual: 3600, status: 'Deposit Paid', vendor: 'Cascade Sound & Staging', dueDate: '2027-05-10' },
        { id: 'b-c4', category: 'Stage, Sound & Generator Power', title: 'Whisper-Quiet Eco Generator & Cable Runners', estimated: 1000, actual: 1000, status: 'Deposit Paid', vendor: 'Cascade Power Rental', dueDate: '2027-06-01' },
        { id: 'b-c5', category: 'Lantern Supplies & Craft Tents', title: '1,500 Eco-friendly Rice Paper Lanterns & LED Lights', estimated: 2200, actual: 2100, status: 'Paid', vendor: 'EcoCraft Lantern Supply', dueDate: '2027-04-15' },
        { id: 'b-c6', category: 'Lantern Supplies & Craft Tents', title: '10x10 Pop-up Shade Tents & Folding Craft Tables', estimated: 1000, actual: 900, status: 'Deposit Paid', vendor: 'Valley Party Rentals', dueDate: '2027-05-20' },
        { id: 'b-c7', category: 'Restrooms & Zero-Waste Recycling', title: 'Portable Luxury Restrooms + 6 ADA Units + Wash Stations', estimated: 2500, actual: 2400, status: 'Deposit Paid', vendor: 'Pacific Sanitation Group', dueDate: '2027-06-01' }
      ]
    },
    timeline: {
      preEvent: [
        { id: 't-cpre-1', phase: '6 Months Out', task: 'Submit City Special Event Permit & Sound Variance Applications', completed: true, owner: 'Committee Chair' },
        { id: 't-cpre-2', phase: '4 Months Out', task: 'Open Food Truck vendor registration & health inspector approvals', completed: true, owner: 'Vendor Lead' },
        { id: 't-cpre-3', phase: '2 Months Out', task: 'Recruit 40 community volunteers for shifts (greeters, cleanup, crafts)', completed: false, owner: 'Volunteer Director' },
        { id: 't-cpre-4', phase: '2 Weeks Out', task: 'Publish lakefront traffic detours and community park notices', completed: false, owner: 'Public Relations' }
      ],
      dayOf: [
        { id: 't-cday-1', time: '10:00', title: 'City Park Grounds & Restroom Delivery Access', location: 'Park South Gate', lead: 'Operations Lead', notes: 'Unlock gates, place sanitation stations, verify water spigots' },
        { id: 't-cday-2', time: '11:30', title: 'Sound Stage Setup & Generator Electrical Distribution', location: 'Amphitheater Lawn', lead: 'Cascade Sound', notes: 'Sound check acoustic mics, distribute yellow safety cable ramps' },
        { id: 't-cday-3', time: '13:00', title: 'Food Truck Load-In & Fire Marshal Inspection', location: 'Boulevard Staging Area', lead: 'Health & Fire Officer', notes: '12 food trucks slotted in assigned spaces with grease mats' },
        { id: 't-cday-4', time: '15:00', title: 'Volunteer Orientation & T-Shirt / Radio Distribution', location: 'Information Pavilion', lead: 'Volunteer Director', notes: 'Radio channel check, water distribution points assign' },
        { id: 't-cday-5', time: '16:00', title: 'Festival Gates Open to Public & Artisan Market Begins', location: 'Park Entrance & Waterfront', lead: 'Committee Greeters', notes: 'Free admission, hand out schedule map leaflets' },
        { id: 't-cday-6', time: '16:30', title: 'Lantern Decorating Workshops Begin', location: 'Craft Tent Pavilion', lead: 'Youth Arts Guild', notes: 'Markers, stickers, calligraphy brushes, biodegradable LED teas' },
        { id: 't-cday-7', time: '17:30', title: 'Acoustic Bands & Folk Songwriters Set', location: 'Main Amphitheater Stage', lead: 'Sound Team', notes: 'Performers: Cascade Pine String Band' },
        { id: 't-cday-8', time: '19:45', title: 'Mayor Welcome Address & Community Award', location: 'Main Amphitheater Stage', lead: 'City Council & Mayor', notes: 'Honor volunteer of the year, sponsor thank-yous' },
        { id: 't-cday-9', time: '20:45', title: 'Grand Twilight Floating Lantern Illumination', location: 'Lakefront Reflection Basin', lead: 'Park Ranger & Safety Team', notes: 'Magical moment: 1,200 illuminated lanterns lit along water edge' },
        { id: 't-cday-10', time: '21:45', title: 'Event Finale Brass Band & Vendor Closing Call', location: 'Amphitheater Stage', lead: 'Operations Lead', notes: 'Remind attendees of zero-waste sorting bins' },
        { id: 't-cday-11', time: '22:30', title: 'Tear Down & Grounds Sweep', location: 'Entire Park Zone', lead: 'Night Shift Volunteers', notes: 'Clean site inspection ready for sunrise park reopening' }
      ]
    },
    vendors: [
      { id: 'v-c1', category: 'City / Municipal', name: 'City of Oakridge Parks & Recreation', contact: 'Dana Kowalski', phone: '(360) 555-4001', email: 'parks@oakridgewa.gov', status: 'Booked', cost: 2400, notes: 'Full park reservation permit, lakefront access, after-hours park ranger support.' },
      { id: 'v-c2', category: 'Sound & Production', name: 'Cascade Sound & Staging LLC', contact: 'Marcus Vance', phone: '(206) 555-7319', email: 'rentals@cascadesound.com', status: 'Booked', cost: 3600, notes: 'Mobile hydraulic stage trailer, line array audio, 4 cordless microphones, on-site technician.' },
      { id: 'v-c3', category: 'Food Trucks Hub', name: 'Northwest Food Truck Association (12 Trucks)', contact: 'Chef Ray Morales', phone: '(206) 555-8902', email: 'coordinator@nwfoodtrucks.org', status: 'Booked', cost: 0, notes: 'Vendor fee revenue-sharing model; guaranteed 12 diverse culinary trucks (Tacos, Dumplings, Gelato, BBQ).' },
      { id: 'v-c4', category: 'Sanitation', name: 'Pacific Sanitation Group', contact: 'Terry Scott', phone: '(253) 555-9080', email: 'terry@pacificsanitation.com', status: 'Booked', cost: 2400, notes: 'Delivers 10 standard restrooms, 2 ADA accessible, 4 handwash stations, plus recycling dumpsters.' }
    ],
    checklists: [
      { id: 'cc-1', category: 'Permits', task: 'Finalize sign-off from County Fire Marshal for generator and propane food trucks', completed: true, priority: 'High', due: '2027-06-20' },
      { id: 'cc-2', category: 'Safety', task: 'Coordinate ambulance EMT station placement and clear emergency vehicle lane', completed: false, priority: 'High', due: '2027-07-01' },
      { id: 'cc-3', category: 'Volunteers', task: 'Conduct 30-minute virtual volunteer training and distribute parking passes', completed: false, priority: 'Medium', due: '2027-07-10' },
      { id: 'cc-4', category: 'Sustainability', task: 'Install 8 Zero-Waste sorting stations with youth volunteer monitors', completed: false, priority: 'Medium', due: '2027-07-17' },
      { id: 'cc-5', category: 'Signage', task: 'Post directional parking arrow signs on Northgate Highway entrance', completed: false, priority: 'Low', due: '2027-07-17' }
    ],
    guests: [
      { id: 'gc-1', name: 'Mayor Helen Thorne', email: 'mayor@oakridge.gov', rsvp: 'Attending', count: 4, dietary: 'None', table: 'VIP Community Roster' },
      { id: 'gc-2', name: 'Oakridge Youth Guild (20 pax)', email: 'director@youtharts.org', rsvp: 'Attending', count: 20, dietary: 'Assorted Dietary', table: 'Craft Workshop Tent' },
      { id: 'gc-3', name: 'Cascade Echo Local Press', email: 'editor@cascadeecho.com', rsvp: 'Attending', count: 2, dietary: 'None', table: 'Media Zone' },
      { id: 'gc-4', name: 'Rotary Club Delegations', email: 'rotary@oakridgecommunity.org', rsvp: 'Attending', count: 12, dietary: 'Vegetarian Options', table: 'Sponsor Table' }
    ]
  }
];

export const AI_PERSONAS = [
  {
    id: 'stylist',
    name: 'Aura Stylist',
    badge: 'Creative Director & Aesthetic Visionary',
    avatar: '✨',
    desc: 'Specializes in moodboards, floral concepts, lighting design, palette harmony, sensory ambiance, and personalized touches.',
    greeting: "Hello! I am your Aura Creative Stylist. Tell me your celebration dream—from magical floral arches and color harmonies to signature cocktails and unforgettable guest favors!"
  },
  {
    id: 'financial',
    name: 'Aura Comptroller',
    badge: 'Budget Architect & Cost Strategist',
    avatar: '💎',
    desc: 'Expert in dynamic budget breakdowns, hidden fee audits, cost-per-guest optimization, contract negotiation tips, and vendor savings.',
    greeting: "Welcome! I am your Financial Planning Strategist. Let's maximize your celebration impact while keeping every dollar accountable, negotiated, and aligned with your budget."
  },
  {
    id: 'stage_manager',
    name: 'Aura Stage Manager',
    badge: 'Logistics & Run-of-Show Director',
    avatar: '⏱️',
    desc: 'Master of minute-by-minute day-of timelines, vendor load-in sequences, weather contingencies, buffer times, and seamless transitions.',
    greeting: "Greetings! I'm your Event Stage Manager. From vendor call-times and photo sequences to weather contingencies and crowd flow, I ensure your event runs like a symphony."
  },
  {
    id: 'community',
    name: 'Aura Community Lead',
    badge: 'Permits, Crowd & Civic Coordinator',
    avatar: '🏮',
    desc: 'Dedicated to community gatherings, block parties, permits, safety regulations, volunteer rosters, and zero-waste sustainability.',
    greeting: "Hi there! I am your Community & Gathering Coordinator. I help you handle civic permits, volunteer shifts, accessible layouts, and high-impact festivals!"
  }
];
