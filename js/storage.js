/* =========================================================
   VELOURA MOTORS — STORAGE.JS
   Single source of truth for car inventory, categories,
   brands, reviews, and shared card-rendering helpers.
   Loaded BEFORE any page-specific script (after common.js).
========================================================= */

/* ---------------------------------------------------------
   CAR INVENTORY (covers all 12 categories)
--------------------------------------------------------- */
const CARS = [
  { id:"lamborghini-revuelto", brand:"Lamborghini", name:"Revuelto", category:"hypercars",
    price:608000, hp:1015, topSpeed:217, accel:"2.5", year:2025, transmission:"Automatic", fuel:"Hybrid", drive:"AWD", seats:2,
    tag:"New Arrival", rating:4.9,
    image:"https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1000&auto=format&fit=crop",
    gallery:["https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1400&auto=format&fit=crop","https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1400&auto=format&fit=crop"],
    desc:"The Revuelto marks Lamborghini's first V12 hybrid super sports car — a manifesto of uncompromising performance and electrified precision." },

  { id:"rolls-royce-spectre", brand:"Rolls-Royce", name:"Spectre", category:"electric-cars",
    price:420000, hp:577, topSpeed:155, accel:"4.5", year:2025, transmission:"Automatic", fuel:"Electric", drive:"AWD", seats:4,
    tag:"Electric", rating:4.8,
    image:"images/RRSPECTRE.jpg",
    gallery:["images/RRSPECTRE.jpg","https://blackfoxmotors.de/wp-content/uploads/2024/07/394A0556-scaled.jpg"],
    desc:"Rolls-Royce's first fully electric grand tourer — silent, instantaneous, and finished to the marque's uncompromising standard." },

  { id:"bentley-continental-gt-speed", brand:"Bentley", name:"Continental GT Speed", category:"luxury-sedans",
    price:275000, hp:650, topSpeed:208, accel:"3.5", year:2024, transmission:"Automatic", fuel:"Petrol", drive:"AWD", seats:4,
    tag:"Editor's Choice", rating:4.9,
    image:"https://i.guim.co.uk/img/media/b82f4bea757a9d05f45760d2f29a3c7bca9f512d/1614_1350_5059_3038/master/5059.jpg?width=1200&quality=85&auto=format&fit=max&s=bc57a7d6e5926adba86ae91d0f5792ee",
    gallery:["https://i.guim.co.uk/img/media/b82f4bea757a9d05f45760d2f29a3c7bca9f512d/1614_1350_5059_3038/master/5059.jpg?width=1200&quality=85&auto=format&fit=max&s=bc57a7d6e5926adba86ae91d0f5792ee","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBsSeBG0oSGnLyff7BV0moAnSpkXavzR_QsrxwOnfdZP26lIVvNLTG1jp6&s=10"],
    desc:"A handcrafted interior wrapped around a W12 engine that refuses to be ignored. This is not transportation — it's a statement." },

  { id:"ferrari-sf90-stradale", brand:"Ferrari", name:"SF90 Stradale", category:"supercars",
    price:524000, hp:986, topSpeed:211, accel:"2.5", year:2025, transmission:"Automatic", fuel:"Hybrid", drive:"AWD", seats:2,
    tag:"Limited Edition", rating:4.9,
    image:"https://cdn.rmsothebys.com/f/4/9/2/f/e/f492fe6859b9dafbe6b6a5ade3195da89d8f8eea.webp",
    gallery:["https://cdn.rmsothebys.com/f/4/9/2/f/e/f492fe6859b9dafbe6b6a5ade3195da89d8f8eea.webp","https://blackfoxmotors.de/wp-content/uploads/2025/12/394A2865-scaled.jpeg"],
    desc:"Ferrari's first series-production PHEV — a 986bhp manifesto proving electrification can sharpen, not soften, the prancing horse." },

  { id:"mclaren-750s", brand:"McLaren", name:"750S", category:"sports-cars",
    price:332000, hp:740, topSpeed:206, accel:"2.7", year:2024, transmission:"Automatic", fuel:"Petrol", drive:"RWD", seats:2,
    tag:"New Arrival", rating:4.7,
    image:"https://images.cars.com/cldstatic/wp-content/uploads/mclaren-750s-2024-04-exterior-front-scaled.jpg",
    gallery:["https://images.cars.com/cldstatic/wp-content/uploads/mclaren-750s-2024-04-exterior-front-scaled.jpg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-qbp3xfED0qg757m9-WylB0galkCSHaDgbFSalVWVBpO2Zg_7C4TP8FU&s=10"],
    desc:"The lightest, most powerful series-production McLaren sports car yet — sharpened for a purer connection to the road." },

  { id:"aston-martin-db12", brand:"Aston Martin", name:"DB12", category:"convertibles",
    price:245000, hp:671, topSpeed:202, accel:"3.5", year:2024, transmission:"Automatic", fuel:"Petrol", drive:"RWD", seats:4,
    tag:"New Arrival", rating:4.6,
    image:"https://www.edmunds.com/assets/m/cs/blt822e6f94537ea800/6619c9fa0aca6b646c326fe6/2024_aston_martin_db12_volante_1_front_717.jpg",
    gallery:["https://www.edmunds.com/assets/m/cs/blt822e6f94537ea800/6619c9fa0aca6b646c326fe6/2024_aston_martin_db12_volante_1_front_717.jpg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUV6FK9Su5Yj6YuIOwTlUE4LBWvSgT4iu5PMFZX0qbxVrTgSyWs_k5ytk&s=10"],
    desc:"Britain's first 'Super Tourer' — a drop-top grand tourer built to dissolve the line between comfort and outright pace." },

  { id:"porsche-911-turbo-s", brand:"Porsche", name:"911 Turbo S", category:"sports-cars",
    price:230000, hp:640, topSpeed:205, accel:"2.6", year:2024, transmission:"Automatic", fuel:"Petrol", drive:"AWD", seats:4,
    tag:"Best Seller", rating:4.8,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzMl6LzVzZLDK7O21OKz2U8ILo0_KLCTqHQ_0j1BVOvznQIueJ9qGbYTT&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzMl6LzVzZLDK7O21OKz2U8ILo0_KLCTqHQ_0j1BVOvznQIueJ9qGbYTT&s=10","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeQ8Q6EBgD9HWakAQbKDH9cMsOqACVzZsdwOUrUoBRNg&s=10"],
    desc:"The benchmark sports car, refined yet again — everyday usable, track-day brutal." },

  { id:"bugatti-chiron", brand:"Bugatti", name:"Chiron Super Sport", category:"hypercars",
    price:3900000, hp:1578, topSpeed:273, accel:"2.4", year:2023, transmission:"Automatic", fuel:"Petrol", drive:"AWD", seats:2,
    tag:"Collectors Edition", rating:5.0,
    image:"https://media.architecturaldigest.com/photos/56d61c37ce4f38152ccc875f/master/w_1024%2Cc_limit/bugatti-chiron-worlds-fastest-car-02.png",
    gallery:["https://media.architecturaldigest.com/photos/56d61c37ce4f38152ccc875f/master/w_1024%2Cc_limit/bugatti-chiron-worlds-fastest-car-02.png","https://i.gremicdn.pl/image/free/bd45a88860df321e44fd2c5f59ba670c/?t=resize:fill:948:593,enlarge:1"],
    desc:"An engineering monument. Quad-turbo W16, a quarter-mile of restraint, and a top speed that redefined the hypercar era." },

  { id:"lucid-air-sapphire", brand:"Lucid", name:"Air Sapphire", category:"electric-cars",
    price:250000, hp:1234, topSpeed:205, accel:"1.9", year:2025, transmission:"Automatic", fuel:"Electric", drive:"AWD", seats:5,
    tag:"Electric", rating:4.8,
    image:"https://hips.hearstapps.com/hmg-prod/images/2024-lucid-air-sapphire-124-64cd3bf6945b0.jpg?crop=0.670xw:1.00xh;0.269xw,0&resize=1200:*",
    gallery:["https://hips.hearstapps.com/hmg-prod/images/2024-lucid-air-sapphire-124-64cd3bf6945b0.jpg?crop=0.670xw:1.00xh;0.269xw,0&resize=1200:*","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMF29-viKoU9ppZYrqTf5U4B2NQEzvDu1Cp3J4RddL3X-ehJIvJYR5VEs&s=10"],
    desc:"The fastest production EV sedan in the world — tri-motor, track-honed, and quieter than a held breath." },

  { id:"pagani-utopia", brand:"Pagani", name:"Utopia", category:"hypercars",
    price:2400000, hp:852, topSpeed:217, accel:"2.8", year:2024, transmission:"Manual", fuel:"Petrol", drive:"RWD", seats:2,
    tag:"Concept", rating:5.0,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppKgQoAVaiUXZrvK6cb-GrGwvH2ZkBSMs5UM63oUn4g&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppKgQoAVaiUXZrvK6cb-GrGwvH2ZkBSMs5UM63oUn4g&s=10","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Id38fV7YMfWBuJE84gqLNwNu0KF2CwEslybxVloBodJkcKHUnZEFLdbm&s=10"],
    desc:"A hand-built sculpture in carbo-titanium — proof that analogue purity still has a place among modern hypercars." },

  { id:"range-rover-svr", brand:"Land Rover", name:"Range Rover SV", category:"suv",
    price:215000, hp:606, topSpeed:180, accel:"4.4", year:2024, transmission:"Automatic", fuel:"Petrol", drive:"AWD", seats:5,
    tag:"Best Seller", rating:4.6,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSnUZ1H0_pDnuqKLzF8f7ByASpHq1ErA05lceOKGixrA&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSnUZ1H0_pDnuqKLzF8f7ByASpHq1ErA05lceOKGixrA&s=10"],
    desc:"The pinnacle SUV — effortless off-road capability wrapped in a cabin that rivals any flagship sedan." },

  { id:"bentley-bentayga-hybrid", brand:"Bentley", name:"Bentayga Hybrid", category:"hybrid-cars",
    price:215000, hp:443, topSpeed:158, accel:"5.5", year:2024, transmission:"Automatic", fuel:"Hybrid", drive:"AWD", seats:5,
    tag:"Hybrid", rating:4.5,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBEdtj9NS_SD0zYzraOFMoh3qhuyOIlr8wlPuUQqgyMCSPEevs7zE25fJk&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBEdtj9NS_SD0zYzraOFMoh3qhuyOIlr8wlPuUQqgyMCSPEevs7zE25fJk&s=10"],
    desc:"Plug-in luxury without compromise — silent city running, effortless motorway cruising." },

  { id:"ferrari-roma-spider", brand:"Ferrari", name:"Roma Spider", category:"convertibles",
    price:265000, hp:612, topSpeed:198, accel:"3.4", year:2024, transmission:"Automatic", fuel:"Petrol", drive:"RWD", seats:2,
    tag:"New Arrival", rating:4.7,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK_6xjaJSghwAHA5llDdyAuDl_pgCJR05-4lS4DbueOZV92Ue19BSq7mk3&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK_6xjaJSghwAHA5llDdyAuDl_pgCJR05-4lS4DbueOZV92Ue19BSq7mk3&s=10"],
    desc:"La Nuova Dolce Vita, open to the sky — Ferrari's softest edge with all of its sharpest engineering." },

  { id:"jaguar-e-type", brand:"Jaguar", name:"E-Type Series 1", category:"classic-cars",
    price:185000, hp:265, topSpeed:150, accel:"6.9", year:1965, transmission:"Manual", fuel:"Petrol", drive:"RWD", seats:2,
    tag:"Classic", rating:4.9,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2zYK-aHaY32LHepNzqZE_Bo30wbj4kB4ttAg6J3jZpw&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2zYK-aHaY32LHepNzqZE_Bo30wbj4kB4ttAg6J3jZpw&s=10"],
    desc:"Called 'the most beautiful car ever made' by Enzo Ferrari himself — fully restored to concours standard." },

  { id:"mercedes-300sl", brand:"Mercedes-Benz", name:"300 SL Gullwing", category:"collectors-edition",
    price:1450000, hp:215, topSpeed:161, accel:"8.8", year:1955, transmission:"Manual", fuel:"Petrol", drive:"RWD", seats:2,
    tag:"Collectors Edition", rating:5.0,
    image:"https://www.amalgamcollection.com/cdn/shop/articles/M5349-25_-_Mercedes_Benz_300SL_Gullwing_1.8_Scale_-_Front_3.4_Doors_Open_1024x1024.jpg?v=1560934838",
    gallery:["https://www.amalgamcollection.com/cdn/shop/articles/M5349-25_-_Mercedes_Benz_300SL_Gullwing_1.8_Scale_-_Front_3.4_Doors_Open_1024x1024.jpg?v=1560934838"],
    desc:"The icon that defined the gullwing door — one of fewer than 1,400 ever produced, documented provenance included." },

  { id:"koenigsegg-jesko", brand:"Koenigsegg", name:"Jesko Absolut", category:"limited-edition",
    price:3400000, hp:1600, topSpeed:330, accel:"2.5", year:2025, transmission:"Automatic", fuel:"Petrol", drive:"RWD", seats:2,
    tag:"Limited Edition", rating:5.0,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFbu1R6eRQDRQAeCBdW3vMPoOdMjuSuZTEvTWUZsEufQ&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFbu1R6eRQDRQAeCBdW3vMPoOdMjuSuZTEvTWUZsEufQ&s=10"],
    desc:"Engineered purely for top-speed ambition — one of the fastest production cars ever conceived, by allocation only." },

  { id:"mercedes-vision-amg", brand:"Mercedes-AMG", name:"Vision Concept", category:"concept-cars",
    price:0, hp:1340, topSpeed:200, accel:"2.0", year:2026, transmission:"Automatic", fuel:"Electric", drive:"AWD", seats:2,
    tag:"Concept", rating:4.9,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqS_WqfZ4fA-S10VEGYGgsLGnqnd5cYRaR054VyW500sTXoDJt-7zM1-ba&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqS_WqfZ4fA-S10VEGYGgsLGnqnd5cYRaR054VyW500sTXoDJt-7zM1-ba&s=10"],
    desc:"A rolling preview of AMG's electric performance future — not yet for sale, available for private preview booking." },

  { id:"toyota-mirai-concept", brand:"Toyota", name:"Mirai Concept", category:"concept-cars",
    price:0, hp:182, topSpeed:175, accel:"9.0", year:2026, transmission:"Automatic", fuel:"Hydrogen", drive:"RWD", seats:4,
    tag:"Concept", rating:4.3,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd3hUdF3ufymKHmTb9rfdBqtM8aQD6o8U-JdiS_avqEA&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd3hUdF3ufymKHmTb9rfdBqtM8aQD6o8U-JdiS_avqEA&s=10"],
    desc:"Hydrogen fuel-cell propulsion previewed in a sculptural four-door form — zero emissions, three-minute refuelling." },

  { id:"audi-rs-etron-gt", brand:"Audi", name:"RS e-tron GT", category:"electric-cars",
    price:148000, hp:680, topSpeed:155, accel:"2.8", year:2024, transmission:"Automatic", fuel:"Electric", drive:"AWD", seats:4,
    tag:"Electric", rating:4.6,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScZjp5JCwBU3YCTgnwPoRbU8PVq-rCS3VUhwnUVpXLSg&s=10",
    gallery:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScZjp5JCwBU3YCTgnwPoRbU8PVq-rCS3VUhwnUVpXLSg&s=10"],
    desc:"Audi's electric flagship — four rings, zero emissions, and a launch that flattens passengers into their seats." },

  { id:"bmw-xm-label", brand:"BMW", name:"XM Label Red", category:"suv",
    price:212000, hp:738, topSpeed:170, accel:"3.7", year:2024, transmission:"Automatic", fuel:"Hybrid", drive:"AWD", seats:5,
    tag:"Hybrid", rating:4.4,
    image:"https://editorial.pxcrush.net/carsales/general/editorial/bmw-xm-label-red-exterior-03.jpg?width=1024&height=682",
    gallery:["https://editorial.pxcrush.net/carsales/general/editorial/bmw-xm-label-red-exterior-03.jpg?width=1024&height=682"],
    desc:"BMW M's first standalone model in decades — a plug-in hybrid SUV with supercar-baiting numbers." }
];

/* ---------------------------------------------------------
   CATEGORIES (12, matching homepage tiles)
--------------------------------------------------------- */
const CATEGORIES = [
  { key:"luxury-sedans", title:"Luxury Sedans", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS556rJlVFMsH_eiANyadrvaWnsvGR6gTCdy9zQDpc6pg&s=10" },
  { key:"suv", title:"SUV", img:"https://di-uploads-pod14.dealerinspire.com/hondaeastcincy/uploads/2025/12/Honda-Pilot-jellybean.webp" },
  { key:"sports-cars", title:"Sports Cars", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzeLBBPikAaay75zTeEhQkYdkBhKrkcKs2_TBTNMNuQA&s=10" },
  { key:"supercars", title:"Supercars", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmjuKrGexpv93w-iHTeakYzbDBcYwcX_gGrDOOTL8Wmg&s=10" },
  { key:"hypercars", title:"Hypercars", img:"https://www.ilusso.com/wp-content/uploads/Blog-Image-02-8-1024x668.png" },
  { key:"electric-cars", title:"Electric Cars", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHnfT9EC3iBBBIB-W8kNRQvsOt6LTUx7kVNfKgSyB--w&s=10" },
  { key:"hybrid-cars", title:"Hybrid Cars", img:"https://hips.hearstapps.com/mtg-prod/66f5853ac7980500088c330f/2025toyotapriusplug-inhybrid2.jpg?w=768&width=768&q=75&format=webp" },
  { key:"convertibles", title:"Convertibles", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL2Oke3sEbIg6qXmj70N2OHmysQfpUfJjaiqMVULEs3APWe1W0ySnfq4w&s=10" },
  { key:"classic-cars", title:"Classic Cars", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwtx_jH9e_Xd9RgHZm6uuPtVglxscV0c5uS_rxFXTpXYQygPT2EtNrtlZv&s=10" },
  { key:"collectors-edition", title:"Collectors Edition", img:"https://www.yachtscroatia.com/var/site/storage/images/_aliases/i1320/8/5/6/2/522658-1-eng-GB/01145dbf5f3b-Aston-Martin-Valkyrie-LM.jpg.webp" },
  { key:"limited-edition", title:"Limited Edition", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_PksualytG6EqblyjKrqioSjQXrPIZANA45ZFj7u20g&s=10" },
  { key:"concept-cars", title:"Concept Cars", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtJwRYCImvJIy3aeM8GMIHN894mLDRuBbq4eNQyQjGepru4yW1gDnPD7Ez&s=10" }
];

/* ---------------------------------------------------------
   BRANDS
--------------------------------------------------------- */
const BRANDS = [
  "Lamborghini","Rolls-Royce","Bentley","Ferrari","McLaren","Aston Martin","Porsche",
  "Bugatti","Lucid","Pagani","Land Rover","Jaguar","Mercedes-Benz","Mercedes-AMG",
  "Koenigsegg","Audi","BMW","Toyota"
];

/* ---------------------------------------------------------
   REVIEWS
--------------------------------------------------------- */
const REVIEWS = [
  { text:"Veloura didn't just sell me a car — they understood exactly what I wanted before I could explain it myself.", name:"Daniel Cross", role:"Spectre Owner", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { text:"White-glove delivery is not a marketing line here. My Revuelto arrived exactly as promised, down to the last detail.", name:"Amara Osei", role:"Revuelto Owner", avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
  { text:"The concierge team found me a Chiron allocation when three other dealers told me it was impossible.", name:"Hiroshi Tanaka", role:"Chiron Owner", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
];

/* ---------------------------------------------------------
   LOOKUP HELPERS
--------------------------------------------------------- */
function getCarById(id){ return CARS.find(c => c.id === id); }
function getCarsByCategory(cat){ return CARS.filter(c => c.category === cat); }
function getCarsByBrand(brand){ return CARS.filter(c => c.brand.toLowerCase() === brand.toLowerCase()); }
function getRelatedCars(car, n = 4){
  const primary = CARS.filter(c => c.id !== car.id && (c.category === car.category || c.brand === car.brand));
  if (primary.length >= n) return primary.slice(0, n);

  /* backfill so the Related Vehicles section is never under-filled */
  const usedIds = new Set([car.id, ...primary.map(c => c.id)]);
  const backfill = CARS
    .filter(c => !usedIds.has(c.id))
    .sort((a, b) => Math.abs(a.price - car.price) - Math.abs(b.price - car.price));

  return [...primary, ...backfill].slice(0, n);
}
function formatPrice(n){ return n > 0 ? "$" + n.toLocaleString("en-US") : "On Request"; }
function categoryTitle(key){
  const c = CATEGORIES.find(c => c.key === key);
  return c ? c.title : key;
}

/* ---------------------------------------------------------
   CAR CARD RENDERER (shared by home, inventory, wishlist,
   compare, search, arrivals, limited, related-cars blocks)
--------------------------------------------------------- */
function carCardHTML(car, opts = {}){
  const wished = VeloraStore.isWishlisted(car.id);
  const showActions = !!opts.actions;
  return `
    <article class="car-card reveal" data-id="${car.id}">
      <div class="car-card__media">
        <span class="car-card__tag">${car.tag}</span>
        <button class="car-card__wish ${wished ? 'active' : ''}" data-id="${car.id}" aria-label="Toggle wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-9.3-8.8C1.2 8 2.4 5 5.6 4.4 8 4 10 5 12 7c2-2 4-3 6.4-2.6C21.6 5 22.8 8 21.3 11.2 19 15.5 12 20 12 20z"/></svg>
        </button>
        <a href="details.html?id=${car.id}"><img src="${car.image}" alt="${car.brand} ${car.name}" loading="lazy"></a>
      </div>
      <div class="car-card__body">
        <p class="car-card__brand">${car.brand}</p>
        <h3 class="car-card__name">${car.name}</h3>
        <div class="car-card__specs">
          <span>${car.hp} HP</span><span>0–60 in ${car.accel}s</span><span>${car.topSpeed} MPH</span>
        </div>
        <div class="car-card__footer">
          <span class="car-card__price">${formatPrice(car.price)}</span>
          <a class="car-card__view" href="details.html?id=${car.id}">View <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        </div>
        ${showActions ? `
        <div class="car-card__actions">
          <button class="car-card__compare-btn" data-id="${car.id}">+ Compare</button>
          <button class="car-card__cart-btn" data-id="${car.id}">Add to Cart</button>
        </div>` : ''}
      </div>
    </article>
  `;
}

/* Binds wishlist / compare / cart / tilt / reveal behaviour to any
   container holding .car-card elements built by carCardHTML(). */
function bindCarCardEvents(container){
  container.querySelectorAll(".car-card__wish").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      VeloraStore.toggleWishlist(btn.dataset.id);
      btn.classList.toggle("active");
      updateBadges();
      showToast(btn.classList.contains("active") ? "Added to wishlist" : "Removed from wishlist");
    });
  });

  container.querySelectorAll(".car-card__cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      VeloraStore.addToCart(btn.dataset.id, 1);
      updateBadges();
      showToast("Added to cart");
    });
  });

  container.querySelectorAll(".car-card__compare-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const list = VeloraStore.toggleCompare(btn.dataset.id);
      const active = list.includes(btn.dataset.id);
      btn.classList.toggle("active", active);
      btn.textContent = active ? "✓ Comparing" : "+ Compare";
      showToast(active ? "Added to compare" : "Removed from compare");
    });
  });

  /* mark compare buttons that are already active */
  container.querySelectorAll(".car-card__compare-btn").forEach(btn => {
    if (VeloraStore.getCompare().includes(btn.dataset.id)){
      btn.classList.add("active");
      btn.textContent = "✓ Comparing";
    }
  });

  if (window.enableTilt && window.matchMedia("(pointer:fine)").matches){
    container.querySelectorAll(".car-card").forEach(window.enableTilt);
  }

  const lateReveal = container.querySelectorAll(".reveal:not(.revealed)");
  if (lateReveal.length){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){ entry.target.classList.add("revealed"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    lateReveal.forEach(el => obs.observe(el));
  }
}
