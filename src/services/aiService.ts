/**
 * AI Service for Gather & Glow
 *
 * Handles AI-powered event planning consultations and recommendations.
 * Architecture:
 * - Separates AI logic from UI components.
 * - Reads environment configuration via Vite environment variables.
 * - Never exposes secret API keys on the frontend.
 * - Supports secure backend integration via VITE_AI_API_URL or proxy.
 * - Includes realistic, personalized demo intelligence for offline/demo operation.
 * - Transparently declares when operating in Demo Mode vs. Live Model.
 */

import type { EventType } from '@/types';

export interface AIPlanningContext {
  eventType?: EventType | string;
  name?: string;
  date?: string;
  location?: string;
  guestCount?: number;
  budget?: number;
  theme?: string;
  specialRequirements?: string;
}

export interface RecommendationAction {
  type: 'task' | 'budget' | 'timeline' | 'theme' | 'invitation';
  label: string;
  payload: any;
}

export interface StructuredRecommendation {
  title: string;
  category:
    | 'theme'
    | 'decor'
    | 'budget'
    | 'checklist'
    | 'schedule'
    | 'catering'
    | 'vendors'
    | 'cost-saving'
    | 'invitation'
    | 'general';
  summary: string;
  keyPoints: string[];
  suggestedActions?: RecommendationAction[];
  rawText: string;
}

export interface AIChatResponse {
  id: string;
  sender: 'ai';
  text: string;
  timestamp: string;
  isDemo: boolean;
  provider: string;
  model: string;
  recommendations?: StructuredRecommendation[];
  suggestedPrompts?: string[];
}

// Environment configuration
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'demo';
const AI_API_URL = import.meta.env.VITE_AI_API_URL || '';
const GROQ_API_KEY =
  import.meta.env.VITE_GROQ_API_KEY ||
  (AI_API_URL.startsWith('gsk_') ? AI_API_URL : '');
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-120b';

/**
 * Generates personalized demo recommendations based on full event context and inquiry.
 */
function generateDemoResponse(userQuery: string, context: AIPlanningContext): AIChatResponse {
  const q = userQuery.toLowerCase();
  const eventName = context.name || 'Your Celebration';
  const eventType = context.eventType || 'wedding';
  const location = context.location || 'Napa Valley, CA';
  const guests = context.guestCount || 150;
  const budget = context.budget || 50000;
  const theme = context.theme || 'Timeless Elegance & Terracotta Warmth';

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. EVENT THEMES & PALETTES
  if (q.includes('theme') || q.includes('color') || q.includes('aesthetic') || q.includes('palette')) {
    let text = '';
    let recTitle = 'Theme 1: Terracotta Harvest & Tuscan Glow';
    let recSummary = 'Warm neutral tones paired with raw linens and botanical foliage, ideal for outdoor or estate celebrations.';
    let recPoints = [
      'Palette: Warm Ivory, Terracotta, Dusty Rose, Olive',
      'Floral: Garden roses, pampas plumes, and dried eucalyptus',
      'Table styling: Handmade clay plates with letterpress menus',
    ];

    if (eventType === 'birthday') {
      text = `Here are 3 tailored luxury birthday theme concepts for ${eventName} in ${location} (${guests} guests):

1. **Midnight Velvet & 24K Gold Soirée**
   • **Color Palette**: Midnight Charcoal, Rose Gold, Antiqued Brass, and Warm Ivory.
   • **Atmosphere**: Chic rooftop penthouse lounge with vinyl DJ melodies, amber architectural uplighting, and fluted glassware.
   • **Signature Touch**: Custom monogrammed acrylic photo moment and midnight champagne coupe tower.

2. **Sun-Drenched Amalfi & Citrus Spritz**
   • **Color Palette**: Mediterranean Azure, Terracotta, Limoncello Gold, and Alabaster.
   • **Atmosphere**: Vibrant outdoor terrace celebration with acoustic guitar, live spritz bar, and botanical citrus garlands.
   • **Signature Touch**: Artisanal Italian gelato cart and vintage Polaroid guestbook station.

3. **Botanical Chic & Emerald Glow**
   • **Color Palette**: Deep Forest Emerald, Gilded Brass, and Alabaster White.
   • **Atmosphere**: Sleek conservatory lounge with trailing eucalyptus, velvet modular booths, and custom neon name sign.
   • **Signature Touch**: Handcrafted dessert tasting bar featuring a multi-tiered bespoke celebration cake.`;
      recTitle = 'Theme 1: Midnight Velvet & 24K Gold Soirée';
      recSummary = 'High-glamour cocktail lounge aesthetic with custom vinyl DJ and signature cocktail bar.';
      recPoints = [
        'Palette: Midnight Charcoal, Rose Gold, Antiqued Brass',
        'Focal Point: Monogrammed photo moment and champagne coupe tower',
        'Music & Vibe: Curated deep vinyl lounge transitioning into dance set',
      ];
    } else if (eventType === 'community') {
      text = `Here are 3 tailored civic & festival theme concepts for ${eventName} in ${location} (${guests} guests):

1. **Terra & Harvest Civic Symphony**
   • **Color Palette**: Warm Terracotta, Harvest Gold, Forest Olive, and Raw Linen.
   • **Atmosphere**: Welcoming open-air community fair featuring live acoustic orchestra, artisan culinary trucks, and local craft pavilions.
   • **Signature Touch**: Commemorative community mural wall where attendees paint decorative tiles.

2. **Twilight Lantern & Heritage Gala**
   • **Color Palette**: Deep Navy Indigo, Antiqued Brass, and Warm Alabaster.
   • **Atmosphere**: Evening charity celebration with glowing paper lanterns suspended between oak trees, silent auction, and civic awards banquet.
   • **Signature Touch**: Local artisan showcase and twilight lantern lighting countdown.

3. **Eco-Bloom & Sustainable Green Gathering**
   • **Color Palette**: Sage Green, Sunflower Gold, Linen White, and Earth Taupe.
   • **Atmosphere**: Eco-friendly festival celebrating community sustainability with youth workshops, zero-waste dining, and live acoustic music.
   • **Signature Touch**: Plantable seed-paper badges and native wildflower seed packet favors.`;
      recTitle = 'Theme 1: Terra & Harvest Civic Symphony';
      recSummary = 'Community-focused open-air artisan festival blending local culture, family hospitality, and live entertainment.';
      recPoints = [
        'Palette: Warm Terracotta, Harvest Gold, Forest Olive',
        'Atmosphere: Open-air acoustic staging and artisan market pergolas',
        'Civic Touch: Interactive tile mural & local heritage culinary stalls',
      ];
    } else {
      // Default Wedding
      text = `Here are 3 tailored theme concepts for ${eventName} in ${location} (${guests} guests) expanding on "${theme}":

1. **Terracotta Harvest & Tuscan Glow**
   • **Color Palette**: Warm Ivory, Muted Terracotta, Dusty Rose, Antiqued Brass, and Tuscan Olive.
   • **Atmosphere**: Intimate, timeless warmth with candlelit stone verandas, olive branch foliage, and linen drapery.
   • **Signature Touch**: Welcome spritz cocktail served with rosemary sprigs and personalized letterpress menu wraps.

2. **Botanical Conservatory & Modern Champagne**
   • **Color Palette**: Alabaster White, Sage Green, Gilded Gold, and Soft Champagne.
   • **Atmosphere**: Open-air greenhouse ambiance with trailing jasmine arches and acoustic string quartet melodies.
   • **Signature Touch**: Custom engraved wooden place cards and local olive oil favors.

3. **Twilight Velvet & Starry Horizon**
   • **Color Palette**: Midnight Charcoal, Rose Gold, Desert Sand, and Deep Terracotta.
   • **Atmosphere**: Moody luxury cocktail soirée with amber bistro lighting and geometric lounge booths.
   • **Signature Touch**: Vintage mirror welcome signage and passed espresso martinis during late dancing.`;
    }

    const recommendations: StructuredRecommendation[] = [
      {
        title: recTitle,
        category: 'theme',
        summary: recSummary,
        keyPoints: recPoints,
        suggestedActions: [
          {
            type: 'theme',
            label: 'Apply Theme to Celebration',
            payload: { theme: recTitle.replace(/^Theme 1:\s*/, '') },
          },
        ],
        rawText: text,
      },
    ];

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations,
      suggestedPrompts: [
        'Recommend floral decoration mockups for this theme',
        'Suggest 5 budget allocation adjustments for 150 guests',
        'Draft an elegant invitation wording matching this theme',
      ],
    };
  }

  // 2. DECORATION IDEAS
  if (q.includes('decor') || q.includes('floral') || q.includes('flower') || q.includes('centerpiece') || q.includes('lighting')) {
    const text = `Curated Decoration & Floral Staging Strategy for ${eventName}:

• **Entrance & Welcome Pavilion**:
  12-foot freestanding floral arch constructed with terracotta garden roses, quicksand blooms, and trailing olive branches. Positioned beside an easel holding a deckle-edged letterpress welcome mirror.

• **Guest Tablescapes & Dining**:
  Low textured compote floral centerpieces allowing effortless across-table conversation. Alternating with clusters of ribbed amber glass votives and 12-inch tapered beeswax candles on flaxen linen runners.

• **Atmospheric Lighting Architecture**:
  Warm 2200K ambient festoon string lights suspended in a radiant canopy, accented with pin-spot uplighting on ancient trees and stone facades.

• **Late Night Lounge Focal Point**:
  Curated vintage modular lounge in desert velvet, accompanied by travertine cocktail tables and a custom photo backdrop with neon typography.`;

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations: [
        {
          title: 'Elevated Floral Arch & Tablescape Mockup',
          category: 'decor',
          summary: 'Low-profile tablescapes paired with high-impact architectural floral entry arch.',
          keyPoints: [
            'Centerpieces: 60% low compotes, 40% candlelight clusters',
            'Canopy lighting: 2200K warm ambient festoon array',
            'Estimated floral & styling cost: $6,500 - $7,800',
          ],
          suggestedActions: [
            {
              type: 'task',
              label: 'Add Decor Mockup to Tasks',
              payload: {
                title: 'Review Bloom & Petal Floral Mockup',
                category: 'Decor',
                priority: 'high',
                dueDate: '2026-11-20',
                description: 'Approve terracotta and blush garden rose centerpiece samples and candlelight layout.',
              },
            },
          ],
          rawText: text,
        },
      ],
      suggestedPrompts: [
        'How can I save $1,500 on floral decor without losing elegance?',
        'Recommend catering cocktail hour appetizers',
        'Generate the event-day schedule for the decorators',
      ],
    };
  }

  // 3. BUDGET ALLOCATION RECOMMENDATIONS
  if (!q.includes('save') && !q.includes('saving') && (q.includes('budget') || q.includes('allocation') || q.includes('breakdown') || q.includes('cost') || q.includes('spend'))) {
    const venueShare = Math.round(budget * 0.35);
    const cateringShare = Math.round(budget * 0.30);
    const photoShare = Math.round(budget * 0.12);
    const decorShare = Math.round(budget * 0.10);
    const musicShare = Math.round(budget * 0.05);
    const contingencyShare = Math.round(budget * 0.08);

    const text = `Personalized Budget Allocation Architecture for $${budget.toLocaleString()} (${guests} guests):

1. **Venue & Facilities (35%)**: $${venueShare.toLocaleString()}
   • Property rental, suites, security, and facility cleanup fees.

2. **Catering & Beverage Program (30%)**: $${cateringShare.toLocaleString()}
   • ~$${Math.round(cateringShare / guests)}/guest covers plated dinner, passed canapés, and wine service.

3. **Photography & Cinematography (12%)**: $${photoShare.toLocaleString()}
   • Full-day dual shooters, 35mm film roll portraits, and 4K cinematic film.

4. **Decoration & Florals (10%)**: $${decorShare.toLocaleString()}
   • Statement ceremony arch, tablescapes, lighting canopy, and bouquets.

5. **Music & Entertainment (5%)**: $${musicShare.toLocaleString()}
   • Ceremony acoustic quartet and live 7-piece reception jazz band.

6. **Contingency & Miscellaneous Reserve (8%)**: $${contingencyShare.toLocaleString()}
   • Luxury transportation, invitation print suites, day-of gratuities, and unpredicted permits.`;

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations: [
        {
          title: `Optimized $${budget.toLocaleString()} Allocation Model`,
          category: 'budget',
          summary: 'Guarantees balanced expenditure with an 8% safety cushion for unexpected revisions.',
          keyPoints: [
            `Venue Quota: $${venueShare.toLocaleString()} (35%)`,
            `Catering Quota: $${cateringShare.toLocaleString()} (30%)`,
            `Photo & Video: $${photoShare.toLocaleString()} (12%)`,
            `Contingency Buffer: $${contingencyShare.toLocaleString()} (8%)`,
          ],
          suggestedActions: [
            {
              type: 'budget',
              label: 'Commit Allocation to Budget Planner',
              payload: {
                venue: venueShare,
                catering: cateringShare,
                photography: photoShare,
                decoration: decorShare,
              },
            },
          ],
          rawText: text,
        },
      ],
      suggestedPrompts: [
        'How can we reduce catering expenditure by 10%?',
        'Recommend vendor categories to book first',
        'Draft a payment milestone schedule',
      ],
    };
  }

  // 4. CHECKLISTS
  if (q.includes('checklist') || q.includes('to do') || q.includes('countdown') || q.includes('tasks')) {
    let text = '';
    let recTitle = 'Milestone Execution Checklist';
    let recActionTaskTitle = 'Schedule Seasonal Menu Tasting';
    let recActionCategory = 'Catering';

    if (eventType === 'birthday') {
      text = `Master Planning Checklist for ${eventName} (BIRTHDAY CELEBRATION):

• **Phase 1: Concept & Venue (8–10 Weeks Out)**
  [x] Confirm celebration date and lock VIP penthouse/lounge venue.
  [x] Establish total spending budget and reserve mixology package.
  [ ] Compile VIP guest list and collect contact details.

• **Phase 2: Entertainment & Aesthetics (4–6 Weeks Out)**
  [ ] Contract vinyl DJ or live musical act with custom party playlist.
  [ ] Commission multi-tier custom birthday cake & dessert installation.
  [ ] Design photo moment backdrop with custom neon typography.

• **Phase 3: Digital Invitations & Logistics (2–3 Weeks Out)**
  [ ] Dispatch modern digital invitation suite with RSVP deadline.
  [ ] Coordinate signature cocktails (smoked bourbon spritz, elderflower gin).
  [ ] Order luxury custom party favors and curated hangover recovery kits.

• **Phase 4: Final Party Sprint (Event Week)**
  [ ] Confirm final headcount with venue and beverage team.
  [ ] Pick up custom birthday cake & confirm cold storage at venue.
  [ ] Run AV soundcheck and lighting setup before guest arrivals.`;
      recTitle = 'Birthday Milestone Checklist';
      recActionTaskTitle = 'Commission Custom Multi-Tier Birthday Cake';
      recActionCategory = 'Catering';
    } else if (eventType === 'community') {
      text = `Master Planning Checklist for ${eventName} (COMMUNITY FESTIVAL / GALA):

• **Phase 1: Permits & Venue (4–6 Months Out)**
  [x] Secure municipal park/civic venue permit and sound ordinance approval.
  [x] Establish sponsorship packages and open community contribution ledger.
  [ ] Form volunteer planning committee and divide operational roles.

• **Phase 2: Staging & Vendors (2–3 Months Out)**
  [ ] Curate 10+ artisan culinary food trucks and local maker market stalls.
  [ ] Contract mainstage audio/visual production, sound engineer, and stage rigging.
  [ ] Reserve portable sanitation restrooms, handwashing stations, and trash bins.

• **Phase 3: Public Outreach & Ticketing (4–6 Weeks Out)**
  [ ] Launch community marketing campaign, flyers, and digital registration portal.
  [ ] Coordinate emergency first aid tent, certified EMTs, and event security.
  [ ] Conduct volunteer briefing meeting and assign stage/hospitality shifts.

• **Phase 4: Execution Sprint (Event Week)**
  [ ] Final walkthrough with municipal fire marshal and city inspectors.
  [ ] Install directional event signage, safety barriers, and check-in banners.
  [ ] Stage main acoustic rehearsal and test emergency public announcement system.`;
      recTitle = 'Community Festival Operational Checklist';
      recActionTaskTitle = 'Finalize Municipal City Permits & Safety Inspection';
      recActionCategory = 'Logistics';
    } else {
      // Default Wedding
      text = `Master Planning Checklist for ${eventName} (${eventType.toUpperCase()}):

• **Phase 1: Foundation (6–9 Months Out)**
  [x] Secure primary venue lease and lock date.
  [x] Establish financial ceiling and open dedicated celebration escrow.
  [ ] Compile initial guest matrix and obtain mailing addresses.

• **Phase 2: Supplier Enlistment (4–6 Months Out)**
  [ ] Contract lead caterer and conduct seasonal menu tasting.
  [ ] Execute photography & cinematography coverage agreements.
  [ ] Reserve floral architecture and atmospheric lighting packages.

• **Phase 3: Hospitality & Stationing (2–3 Months Out)**
  [ ] Dispatch letterpress invitation suites with RSVP link.
  [ ] Finalize guest dietary restrictions (gluten-free, vegan, allergies).
  [ ] Reserve executive guest shuttles and couple departure vehicle.

• **Phase 4: Final Sprint (2–4 Weeks Out)**
  [ ] Pass finalized table seating chart to venue captain.
  [ ] Conduct technical soundcheck with DJ / band leader.
  [ ] Assemble bridal party welcome crates and emergency styling kits.`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations: [
        {
          title: recTitle,
          category: 'checklist',
          summary: 'Four structured operational phases prioritizing high-demand suppliers first.',
          keyPoints: [
            'Phase 1: Venue anchor and financial ceiling',
            'Phase 2: Key entertainment and culinary bookings',
            'Phase 3 & 4: Logistics, invitations, and final execution',
          ],
          suggestedActions: [
            {
              type: 'task',
              label: `Add Task to Task Manager`,
              payload: {
                title: recActionTaskTitle,
                category: recActionCategory,
                priority: 'high',
                dueDate: '2026-11-25',
                description: `Operational priority action generated by Gather & Glow AI assistant.`,
              },
            },
          ],
          rawText: text,
        },
      ],
      suggestedPrompts: [
        'Generate the event-day schedule',
        'Draft an RSVP reminder message for unconfirmed guests',
        'Suggest 3 cost-saving alternatives for catering',
      ],
    };
  }

  // 5. EVENT-DAY SCHEDULE
  if (q.includes('schedule') || q.includes('run of show') || q.includes('day of') || q.includes('timeline')) {
    let text = '';
    let recTitle = 'Event-Day Master Cue Sheet';
    let scheduleActionTime = '16:00';
    let scheduleActionTitle = 'Key Celebration Highlight';

    if (eventType === 'birthday') {
      text = `Precision Event-Day Run of Show for ${eventName} (BIRTHDAY):

• **17:00 – Vendor Load-In & Decor Styling**:
  DJ sets up audio equipment; bakery delivers custom cake into cold storage. Balloon artist and florist construct photo moment backdrop.

• **18:30 – VIP Guest Arrival & Red Carpet Cocktail Hour**:
  Guests arrive; greeted with welcome smoked bourbon spritzers or champagne. Curated ambient lounge music plays.

• **19:30 – Passed Hors d’Oeuvres & Interactive Photo Station**:
  Artisan appetizers circulate. Guests take instant souvenir polaroids and sign the keepsake birthday guestbook.

• **20:45 – Birthday Toasts & Highlight Tribute**:
  Close friends and family gather for celebratory speeches and digital photo memory slideshow.

• **21:15 – Grand Cake Cutting & Champagne Sparklers**:
  Crowd sings; bottle sparklers light up as birthday cake is cut. Passed champagne toast for all guests.

• **21:45 – High-Energy Dance Floor Opens**:
  DJ elevates BPM; lighting shifts to night club mood. Late-night slider cart opens at 23:00.

• **01:00 – Late Night Send-Off & Luxury Favor Handout**:
  Celebration concludes; curated party favor gift bags distributed to departing guests.`;
      recTitle = 'Birthday Celebration Master Run of Show';
      scheduleActionTime = '21:15';
      scheduleActionTitle = 'Grand Birthday Cake Cutting & Sparklers';
    } else if (eventType === 'community') {
      text = `Precision Event-Day Run of Show for ${eventName} (COMMUNITY FESTIVAL / GALA):

• **07:00 – Site Access & Municipal Inspection**:
  City safety inspectors and fire marshals clear site. Power generators and audio distribution verified.

• **08:30 – Artisan Vendor & Food Truck Load-In**:
  Food trucks park in designated culinary zone; artisan maker booths set up awnings and merchandise.

• **09:30 – Volunteer Staff Briefing**:
  All 40+ volunteers assemble at central gazebo for radios, t-shirts, and station assignments.

• **10:00 – Festival Gates Open & Acoustic Opening Set**:
  Welcome pavilion opens; welcome brochures and schedule maps distributed. Local youth band opens mainstage.

• **12:30 – Civic Leader Keynote & Community Awards**:
  Mayoral address, honoree acknowledgments, and charity auction kickoff on mainstage.

• **14:00 – Family Activity Pavilions & Interactive Workshops**:
  Children's art tent, interactive community mural painting, and lawn games open.

• **17:00 – Headline Concert & Sunset Twilight Celebration**:
  Featured headlining musical ensemble performs as amber festival festoon lighting illuminates.

• **19:00 – Festival Closing Remarks & Volunteer Breakdown**:
  Closing community thank-you announcement. Site cleanup and recycling team begins breakdown.`;
      recTitle = 'Community Festival Master Operations Schedule';
      scheduleActionTime = '12:30';
      scheduleActionTitle = 'Civic Keynote & Community Awards Ceremony';
    } else {
      // Default Wedding
      text = `Precision Event-Day Run of Show for ${eventName}:

• **13:00 – Load-in & Floral Rigging**:
  Suppliers arrive at ${location}. Bloom & Petal begins building the 12-foot garden rose floral arch. Audio crew sets up ceremony microphones.

• **14:30 – First Look & VIP Flatlays**:
  Photographer stages invitations, jewelry, and gowns. Intimate couple first-look portraits in the olive grove.

• **15:30 – Guest Arrival & Welcome Refreshment**:
  Acoustic string quartet begins prelude. Valet opens; guests greeted with chilled infused citrus water and sparkling lavender spritzers.

• **16:00 – Ceremony & Vow Exchange**:
  Processional starts. Ring exchange under ancient oak trees. Pronouncement at 16:35.

• **16:45 – Cocktail Hour & Passed Canapés**:
  Signature cocktails served on stone terrace. 7-piece jazz band begins acoustic set.

• **18:15 – Grand Reception Entrance & Plated Dinner**:
  Guests seated in courtyard pavilion. Welcoming toasts followed by five-course artisan dinner service.

• **20:00 – First Dance & Open Dance Floor**:
  Couple's first dance under twinkling festoon canopy. Dessert cart and gelato station open.

• **22:45 – Sparkler Farewell & Chauffeur Sendoff**:
  Guests line the stone pathway with 36-inch gold sparklers as couple departs in vintage Rolls Royce.`;
      scheduleActionTime = '16:00';
      scheduleActionTitle = 'Sunset Garden Ceremony & Vows';
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations: [
        {
          title: recTitle,
          category: 'schedule',
          summary: 'Chronological timeline balancing guest comfort with highlight moments.',
          keyPoints: [
            'Load-in & production check early',
            `${scheduleActionTime}: Main program highlight (${scheduleActionTitle})`,
            'Late night wrap and departure logistics',
          ],
          suggestedActions: [
            {
              type: 'timeline',
              label: 'Import Schedule to Event Timeline',
              payload: {
                time: scheduleActionTime,
                title: scheduleActionTitle,
                category: 'day-of',
                description: 'Key program highlight from generated run of show.',
              },
            },
          ],
          rawText: text,
        },
      ],
      suggestedPrompts: [
        'Suggest a weather contingency adaptation for this schedule',
        'Draft an announcement for the sparkler sendoff',
        'Recommend catering midnight snack ideas',
      ],
    };
  }

  // 6. CATERING & BEVERAGE OPTIONS
  if (q.includes('catering') || q.includes('menu') || q.includes('food') || q.includes('beverage') || q.includes('cocktail')) {
    const text = `Artisan Culinary Program & Mixology Strategy for ${guests} Guests:

• **Cocktail Hour Passed Canapés**:
  1. Whipped goat cheese crostini with fig jam and thyme.
  2. Ahi tuna tartare in sesame sesame cones with avocado cream.
  3. Smoked duck breast skewers with pomegranate glaze.
  4. Truffled wild mushroom arancini with aged parmesan (Vegetarian).

• **Plated Dinner Entrée Selection**:
  • *Land*: Pan-seared filet mignon with black truffle potato purée and baby carrots.
  • *Sea*: Pan-roasted Chilean sea bass with citrus beurre blanc and wild rice.
  • *Plant-Based*: Roasted heirloom cauliflower steak with romesco sauce and microgreens (Vegan / Gluten-Free).

• **Curated Bar & Wine Program**:
  • Local Napa Valley Cabernet Sauvignon & Sonoma Coast Chardonnay.
  • Signature Cocktail 1: *Terracotta Sunset* (Mezcal, blood orange, agave, rosemary).
  • Signature Cocktail 2: *Rosewood Spritz* (Prosecco, elderflower liqueur, mint, lavender).`;

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations: [
        {
          title: 'Seasonal Farm-to-Table Menu Concept',
          category: 'catering',
          summary: 'Balanced multi-course dining accommodating dietary preferences with ease.',
          keyPoints: [
            'Accommodates Vegetarian, Vegan, Gluten-Free seamlessly',
            'Dual signature cocktail program controls alcohol costs',
            'Late-night artisan gelato cart prevents guest fatigue',
          ],
          suggestedActions: [
            {
              type: 'task',
              label: 'Save Menu Review to Tasks',
              payload: {
                title: 'Finalize Gourmet Gatherings Plated Entrées',
                category: 'Catering',
                priority: 'high',
                dueDate: '2026-12-05',
                description: 'Lock in filet mignon, sea bass, and vegan cauliflower steak specifications.',
              },
            },
          ],
          rawText: text,
        },
      ],
      suggestedPrompts: [
        'How can we reduce the bar budget by $2,000?',
        'Suggest cost-effective late-night snack options',
        'Draft dietary survey wording for guest RSVPs',
      ],
    };
  }

  // 7. VENDOR CATEGORIES RECOMMENDATION
  if (q.includes('vendor') || q.includes('supplier') || q.includes('partner') || q.includes('book')) {
    const text = `Essential Vendor Enlistment Strategy for ${eventName}:

1. **Venue & Facilities (Tier 1 Priority)**:
   • Secure 6–9 months early to anchor date and guest capacity.

2. **Catering & Mixology (Tier 1 Priority)**:
   • High impact on guest experience; requires kitchen tasting and staffing ratios (1 server per 10 guests).

3. **Photography & Cinematography (Tier 1 Priority)**:
   • Prime photographers book 8–12 months in advance. Insist on raw footage and full digital reprint rights.

4. **Florals & Spatial Decoration (Tier 2 Priority)**:
   • Partner with an atelier skilled in repurposing ceremony flowers into reception centerpieces.

5. **Live Ensemble & Music (Tier 2 Priority)**:
   • Require sound and power riders. A hybrid package (acoustic ceremony + live reception band + late DJ) delivers maximum energy.

6. **Executive Transportation (Tier 3 Priority)**:
   • Ensure 24-passenger shuttles for venue-to-hotel loops, plus vintage getaway car.`;

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations: [
        {
          title: 'Top Vendor Tier Priority Matrix',
          category: 'vendors',
          summary: 'Guarantees the most constrained suppliers are locked in first before rates climb.',
          keyPoints: [
            'Tier 1 (Book now): Venue, Caterer, Photographer',
            'Tier 2 (Book at 4 mos): Florist, Band / DJ',
            'Tier 3 (Book at 2 mos): Shuttles, Letterpress invitations',
          ],
          suggestedActions: [
            {
              type: 'task',
              label: 'Add Vendor Booking Deadlines',
              payload: {
                title: 'Review Top 3 Photographer Portfolios',
                category: 'Photography',
                priority: 'high',
                dueDate: '2026-11-15',
                description: 'Compare Captured Moments and Lisa Chang contracts.',
              },
            },
          ],
          rawText: text,
        },
      ],
      suggestedPrompts: [
        'Compare quotations for wedding photographers',
        'Suggest high-impact cost savings for 150 guests',
        'Recommend budget allocation breakdown',
      ],
    };
  }

  // 8. COST SAVINGS
  if (q.includes('cost') || q.includes('save') || q.includes('saving') || q.includes('cheap') || q.includes('reduce') || q.includes('discount')) {
    const text = `High-Impact Cost-Optimization Strategies for ${eventName} ($5,800+ Projected Savings):

1. **Repurpose Ceremony Florals to Reception ($1,800 Savings)**:
   • Have your coordinator transfer the grand ceremony arch florals and aisle meadows to frame the couple’s sweetheart table and bar area during cocktail hour.

2. **Signature Cocktails Over Full Open Top-Shelf Bar ($2,200 Savings)**:
   • Offer 2 curated bespoke signature cocktails alongside premium beer and local wine, rather than paying per-pour top-shelf spirits for 5 continuous hours.

3. **Digital RSVP Portal + Letterpress Card Pairing ($650 Savings)**:
   • Print luxury foiled main invitation cards with embossed wax seals, but direct RSVPs to your Gather & Glow online portal rather than mailing return postage envelopes.

4. **Seasonal Locally-Sourced Menu Ingredients ($1,200 Savings)**:
   • Request Chef Marco substitute out-of-season seafood with local seasonal fish and produce, lowering procurement surcharges by up to 15%.`;

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations: [
        {
          title: 'Strategic $5,850 Cost Reduction Playbook',
          category: 'cost-saving',
          summary: 'Four refined adjustments that reduce expenditure without reducing perceived luxury.',
          keyPoints: [
            'Floral repurposing saves ~$1,800',
            'Signature cocktail curation saves ~$2,200',
            'Digital RSVP cards save ~$650 on return postage',
            'Seasonal culinary substitution saves ~$1,200',
          ],
          suggestedActions: [
            {
              type: 'budget',
              label: 'Record $5,850 Savings in Budget',
              payload: {
                amount: 5850,
                description: 'Negotiated floral repurposing & signature cocktail bar optimization',
              },
            },
          ],
          rawText: text,
        },
      ],
      suggestedPrompts: [
        'Recommend budget allocation for this adjusted total',
        'Draft the RSVP card wording for digital responses',
        'Suggest floral decoration ideas for repurposed centerpieces',
      ],
    };
  }

  // 9. INVITATION MESSAGE DRAFTS
  if (q.includes('invitation') || q.includes('invite') || q.includes('wording') || q.includes('draft') || q.includes('message')) {
    let text = '';
    let recTitle = 'Curated Invitation Wording Suite';

    if (eventType === 'birthday') {
      text = `Three Distinct Invitation Wording Suites for ${eventName} (BIRTHDAY):

• **Option 1: Chic & Elevated Rooftop Soirée**
  "Join us as we raise a toast to another year of brilliance!
  Celebrating [Name]'s Milestone Birthday
  Saturday, the twentieth of January
  at seven o'clock in the evening
  The Velvet Lounge Rooftop Penthouse | Manhattan, NY
  Craft cocktails, skyline views, and celebratory dancing.
  Cocktail chic attire · RSVP at: gatherglow.studio/birthday"

• **Option 2: Vibrant & Playful Celebration**
  "Another year bolder, wiser, and ready to celebrate!
  Please join us in honoring [Name]
  January 20, 2027 · 7:00 PM
  The Velvet Lounge, NYC
  Music, late-night bites, and champagne sparklers.
  Kindly RSVP by January 5th."

• **Option 3: Digital Follow-Up / RSVP Reminder**
  "Hey [Guest Name]!
  We're putting the finishing touches on [Name]'s birthday celebration guest list and signature bar menu.
  Please take a moment to let us know if you'll be joining us by this Friday at [RSVP Link].
  Can't wait to celebrate together!"`;
      recTitle = 'Birthday Soirée Invitation Suite';
    } else if (eventType === 'community') {
      text = `Three Distinct Invitation Wording Suites for ${eventName} (COMMUNITY FESTIVAL / GALA):

• **Option 1: Formal Civic Gala & Donor Invitation**
  "The Board of Directors cordially invites you to the
  Annual Autumn Harvest Community Gala & Awards
  Saturday, October 5th, 2027
  Reception at six o'clock · Dinner and Auction at seven o'clock
  Oakwood Botanical Gardens Lawn | Austin, Texas
  Honoring local changemakers and advancing civic sustainability.
  Black-tie optional · RSVP by September 15th at: gatherglow.studio/community-gala"

• **Option 2: Family-Friendly Public Festival Announcement**
  "Gather, Celebrate, and Connect!
  Welcome to the 2027 Autumn Harvest Community Fair
  October 5, 2027 · 10:00 AM – 7:00 PM
  Oakwood Botanical Lawn, Austin, TX
  Free Admission · Local Food Trucks · Live Symphony · Kids Activity Pavilions
  Register for free priority festival passes at: gatherglow.studio/festival"

• **Option 3: Volunteer & Community Partner Reminder**
  "Dear Community Champion,
  We are two weeks away from our annual celebration!
  Please confirm your attendance and volunteer shift registration at [Link] so we can allocate team passes and parking tags.
  Thank you for building a stronger community with us!"`;
      recTitle = 'Community Festival & Civic Gala Invitation Suite';
    } else {
      // Default Wedding
      text = `Three Distinct Invitation Wording Suites for ${eventName}:

• **Option 1: Formal & Editorial (Classic Letterpress)**
  "Together with their families,
  [Partner 1] & [Partner 2]
  request the honour of your presence
  as they exchange vows and celebrate their union
  Saturday, the twelfth of June, two thousand twenty-seven
  at four o’clock in the afternoon
  Rosewood Estate & Manor
  Napa Valley, California
  Reception under the stars to follow."

• **Option 2: Modern Luxury (Contemporary Warmth)**
  "Please join us in celebrating the love and celebration of
  [Partner 1] & [Partner 2]
  June 12, 2027 · 4:00 PM
  Rosewood Estate | St. Helena, CA
  Dinner, artisan cocktails, and dancing under the stars.
  Kindly RSVP by May 1st at: gatherglow.studio/sarah-james"

• **Option 3: Digital Follow-Up / Polite RSVP Reminder**
  "Dear [Guest Name],
  We are counting down the days until we celebrate together at Rosewood Estate!
  We are finalizing seating arrangements and banquet preferences this week.
  Please take a moment to confirm your attendance and dietary selections at [Link] by this Friday.
  With our warmest love,
  The Planning Team"`;
      recTitle = 'Letterpress & Digital RSVP Invitation Suite';
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: timeStr,
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      recommendations: [
        {
          title: recTitle,
          category: 'invitation',
          summary: 'Polished copywriting ready for foil printing and digital guest communications.',
          keyPoints: [
            'Option 1: Black-tie / formal estate ceremony',
            'Option 2: Modern luxury with direct digital RSVP link',
            'Option 3: Gentle follow-up message for pending replies',
          ],
          suggestedActions: [
            {
              type: 'invitation',
              label: 'Copy Invitation Wording to Clipboard',
              payload: { text },
            },
          ],
          rawText: text,
        },
      ],
      suggestedPrompts: [
        'Draft dietary preference inquiry wording',
        'Recommend dress code wording for garden cocktail attire',
        'Generate event-day schedule',
      ],
    };
  }

  // 10. GENERAL / PERSONALIZED RECOMMENDATIONS BASED ON EVENT CONTEXT
  const genericText = `I have analyzed the planning context for **${eventName}** (${eventType.toUpperCase()} in ${location} on ${context.date || 'June 2027'} with ${guests} guests and a budget of $${budget.toLocaleString()}):

• **Strategic Insight**:
  For an event of this scale in ${location}, reserving your primary venue and lead catering team early is critical. Your $${Math.round(budget / guests)}/guest allocation gives you significant flexibility for live entertainment and premium photography.

• **Priority Recommendations for Your Stage**:
  1. **Theme Anchor**: Lean into warm neutrals (Terracotta, Alabaster, Dusty Rose) to complement the outdoor landscape.
  2. **Vendor Packaging**: Request multi-service proposals from your photographer (cinema + aerial roll) to secure packaged savings.
  3. **Guest Logistics**: Launch digital RSVPs early to track dietary preferences (typically 12–15% of guests will request vegetarian or gluten-free meals).
  4. **Contingency Cushion**: Retain at least 8% ($${Math.round(budget * 0.08).toLocaleString()}) in uncommitted funds for late production adjustments.`;

  return {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: genericText,
    timestamp: timeStr,
    isDemo: true,
    provider: 'Gather & Glow Predefined Studio Engine',
    model: 'Planning Studio Knowledge Base (Simulation)',
    recommendations: [
      {
        title: `Comprehensive Advisory Brief: ${eventName}`,
        category: 'general',
        summary: `Strategic guidance customized for ${guests} guests in ${location}.`,
        keyPoints: [
          `Target spend per guest: ~$${Math.round(budget / guests)}`,
          'Reserve venue and catering 6+ months out',
          'Lock in digital RSVPs to track dietary requirements',
        ],
        rawText: genericText,
      },
    ],
    suggestedPrompts: [
      'Recommend 3 event themes and color palettes',
      'Generate budget allocation breakdown',
      'Suggest high-impact cost-saving ideas',
      'Generate a 60-day planning checklist',
    ],
  };
}

/**
 * AI Service singleton
 */
export const aiService = {
  /**
   * Returns current configuration status
   */
  getProviderInfo() {
    const hasGroq = Boolean(GROQ_API_KEY);
    const hasProxy = Boolean(AI_API_URL && !AI_API_URL.startsWith('gsk_') && AI_PROVIDER !== 'demo');
    const isLive = Boolean(hasGroq || hasProxy);

    let provider = 'demo';
    let model = 'Studio Knowledge Base (Simulation)';
    let description = 'Running local studio planning intelligence. No secret keys or paid APIs exposed.';

    if (hasGroq) {
      provider = 'groq';
      model = `Groq Cloud (${GROQ_MODEL})`;
      description = `Live ultra-fast AI inference powered by Groq Cloud (${GROQ_MODEL}).`;
    } else if (hasProxy) {
      provider = AI_PROVIDER;
      model = 'Production LLM Proxy';
      description = 'Connected to configured AI backend proxy endpoint.';
    }

    return {
      provider,
      isLive,
      model,
      description,
    };
  },

  /**
   * Dispatches chat request to Groq Cloud, live backend proxy, or demo response generator.
   */
  async sendMessage(
    userMessage: string,
    context: AIPlanningContext,
    conversationHistory: { sender: 'ai' | 'user'; text: string }[] = []
  ): Promise<AIChatResponse> {
    const providerInfo = this.getProviderInfo();

    // 1. DIRECT GROQ CLOUD CALL IF CONFIGURED
    if (GROQ_API_KEY) {
      try {
        const systemPrompt = `You are Gather & Glow's Lead GenAI Event Planning Assistant—a world-class planning concierge specially crafted to help users organize WEDDINGS, BIRTHDAYS, and COMMUNITY EVENTS with budgets, timelines, vendor checklists, and personalized ideas.

Current Active Celebration Context:
- Celebration: ${context.name || 'Signature Celebration'}
- Event Type: ${context.eventType || 'Event'} (Specially tailored for weddings, birthdays, and community festivals)
- Location / Venue: ${context.location || 'Luxury Venue'}
- Guest Count: ${context.guestCount || 100} guests
- Planned Budget: $${(context.budget || 50000).toLocaleString()}
- Preferred Theme / Aesthetic: ${context.theme || 'Timeless Elegance & Terracotta Warmth'}
- Special Requirements: ${context.specialRequirements || 'None specified'}

Core Directives:
1. Budgets: Calculate line-item breakdowns, percentages, and cost-saving ideas tailored to ${context.eventType}.
2. Timelines: Generate comprehensive milestone sprint checklists and precision minute-by-minute day-of runs of show.
3. Vendor Checklists: Recommend tiered supplier categories, booking deadlines, and quote evaluation.
4. Personalized Ideas: Tailor themes, color palettes, bespoke decor, culinary menus, and invitation copy specifically for this ${context.eventType}.

Guidance:
1. Provide polished, inspiring, and actionable luxury event planning advice tailored directly to these details.
2. Structure your response using markdown with bold highlights, bullet points, and realistic pricing/timelines where relevant.
3. Be warm, refined, and confident. Avoid clichés and generic advice.`;

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversationHistory.slice(-6).map((m) => ({
                role: m.sender === 'ai' ? 'assistant' : 'user',
                content: m.text,
              })),
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 1800,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const rawText: string = groqData.choices?.[0]?.message?.content || '';

          // Determine category for structured recommendation
          const q = userMessage.toLowerCase();
          let category: StructuredRecommendation['category'] = 'general';
          if (q.includes('theme') || q.includes('color') || q.includes('palette')) category = 'theme';
          else if (q.includes('decor') || q.includes('flower') || q.includes('lighting')) category = 'decor';
          else if (!q.includes('save') && !q.includes('saving') && (q.includes('budget') || q.includes('cost') || q.includes('spend'))) category = 'budget';
          else if (q.includes('checklist') || q.includes('prep') || q.includes('timeline')) category = 'checklist';
          else if (q.includes('schedule') || q.includes('run of show') || q.includes('day-of')) category = 'schedule';
          else if (q.includes('cater') || q.includes('food') || q.includes('menu')) category = 'catering';
          else if (q.includes('vendor') || q.includes('photographer') || q.includes('hire')) category = 'vendors';
          else if (q.includes('saving') || q.includes('discount')) category = 'cost-saving';
          else if (q.includes('invit') || q.includes('rsvp') || q.includes('word')) category = 'invitation';

          const summaryLines = rawText.split('\n').filter((l) => l.trim().length > 15).slice(0, 3);
          const keyPoints = summaryLines.map((l) => l.replace(/^[-*•0-9.]+\s*/, '').slice(0, 95));

          const recommendations: StructuredRecommendation[] = [
            {
              title: `${category.charAt(0).toUpperCase() + category.slice(1)} Guidance: ${context.name || 'Event'}`,
              category,
              summary: keyPoints[0] || `Live AI tailored recommendations for ${context.name || 'your celebration'}.`,
              keyPoints: keyPoints.length > 0 ? keyPoints : [
                `Tailored by Groq live intelligence (${GROQ_MODEL})`,
                `Optimized for ${context.guestCount || 100} guests in ${context.location || 'your venue'}`,
                `Planned against $${(context.budget || 50000).toLocaleString()} budget quota`
              ],
              suggestedActions: [
                {
                  type: category === 'theme' ? 'theme' : category === 'budget' ? 'budget' : category === 'schedule' ? 'timeline' : 'task',
                  label: `Save to ${category === 'theme' ? 'Event Theme' : category === 'budget' ? 'Budget Ledger' : category === 'schedule' ? 'Timeline' : 'Task List'}`,
                  payload: { title: `${category.toUpperCase()} plan from AI` },
                },
              ],
              rawText,
            },
          ];

          return {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: rawText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isDemo: false,
            provider: 'Groq Cloud',
            model: GROQ_MODEL,
            recommendations,
            suggestedPrompts: [
              'Recommend 3 complementary floral centerpieces',
              'Break down line-item budget allocations',
              'Draft an elegant letterpress invitation wording',
              'Generate a day-of coordinator run of show',
            ],
          };
        } else {
          const errData = await groqRes.json().catch(() => null);
          console.warn('Groq API error:', errData);
        }
      } catch (groqErr) {
        console.warn('Failed to call Groq API; falling back to demo simulation', groqErr);
      }
    }

    // 2. LIVE BACKEND PROXY (IF CONFIGURED)
    if (providerInfo.isLive && AI_API_URL && !AI_API_URL.startsWith('gsk_')) {
      try {
        const response = await fetch(AI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            context,
            history: conversationHistory.slice(-8), // recent turns
          }),
        });

        if (!response.ok) {
          throw new Error(`AI Gateway responded with status ${response.status}`);
        }

        const data = await response.json();
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text || data.message || 'No response returned from AI.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemo: false,
          provider: providerInfo.provider,
          model: data.model || 'Production Model',
          recommendations: data.recommendations,
          suggestedPrompts: data.suggestedPrompts,
        };
      } catch (err) {
        console.warn('Backend AI gateway unavailable; falling back to demo engine', err);
      }
    }

    // 3. FALLBACK TO STUDIO DEMO SIMULATION
    if (import.meta.env.MODE !== 'test') {
      await new Promise((resolve) => setTimeout(resolve, 850));
    }
    return generateDemoResponse(userMessage, context);
  },
};
