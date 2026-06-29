/* =========================================================
   VELOURA MOTORS — FILTERS.JS
   Pure filtering/sorting engine shared by inventory.js and
   search.js. No DOM here — just data in, data out.
========================================================= */

const VeloraFilters = (() => {

  /* state shape:
     {
       categories: [],     // array of category keys
       brands: [],         // array of brand names
       priceMax: Infinity,
       yearMin: 0,
       transmission: [],   // ["Automatic","Manual"]
       fuel: [],           // ["Petrol","Electric","Hybrid","Hydrogen"]
       drive: [],          // ["AWD","RWD"]
       seats: [],          // [2,4,5]
       hpMin: 0,
       search: ""
     }
  */
  function defaultState(){
    return {
      categories: [], brands: [], priceMax: Infinity, yearMin: 0,
      transmission: [], fuel: [], drive: [], seats: [], hpMin: 0, search: ""
    };
  }

  function apply(cars, state){
    return cars.filter(car => {
      if (state.categories.length && !state.categories.includes(car.category)) return false;
      if (state.brands.length && !state.brands.includes(car.brand)) return false;
      if (car.price > 0 && car.price > state.priceMax) return false;
      if (car.year < state.yearMin) return false;
      if (state.transmission.length && !state.transmission.includes(car.transmission)) return false;
      if (state.fuel.length && !state.fuel.includes(car.fuel)) return false;
      if (state.drive.length && !state.drive.includes(car.drive)) return false;
      if (state.seats.length && !state.seats.includes(car.seats)) return false;
      if (car.hp < state.hpMin) return false;
      if (state.search){
        const q = state.search.toLowerCase();
        const haystack = `${car.brand} ${car.name} ${car.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function sort(cars, sortKey){
    const list = [...cars];
    switch(sortKey){
      case "price-asc": return list.sort((a,b) => a.price - b.price);
      case "price-desc": return list.sort((a,b) => b.price - a.price);
      case "hp-desc": return list.sort((a,b) => b.hp - a.hp);
      case "year-desc": return list.sort((a,b) => b.year - a.year);
      case "name-asc": return list.sort((a,b) => (a.brand + a.name).localeCompare(b.brand + b.name));
      default: return list;
    }
  }

  function paginate(cars, page, perPage){
    const start = (page - 1) * perPage;
    return cars.slice(start, start + perPage);
  }

  return { defaultState, apply, sort, paginate };
})();
