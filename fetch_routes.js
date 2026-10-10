const start = "-38.527436,-3.73086";
const destinations = [
  { name: "Av. Monsenhor Tabosa - Praia de Iracema", coords: "-38.515201,-3.722512" },
  { name: "Av. Desembargador Moreira - Aldeota", coords: "-38.503000,-3.736000" },
  { name: "Av. da Universidade - Benfica", coords: "-38.538000,-3.742000" },
  { name: "Rua Frederico Borges - Varjota", coords: "-38.490000,-3.733000" },
  { name: "Av. Washington Soares - Iguatemi", coords: "-38.488000,-3.755000" }
];

async function fetchRoute(dest) {
  const url = `http://router.project-osrm.org/route/v1/driving/${start};${dest.coords}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.routes && json.routes[0]) {
      const coords = json.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      return { name: dest.name, coords };
    }
  } catch (e) {
    console.error(e);
  }
  return { name: dest.name, coords: [] };
}

async function run() {
  const routes = [];
  for (const dest of destinations) {
    const r = await fetchRoute(dest);
    const mid = Math.floor(r.coords.length / 2);
    routes.push({
      start: r.coords[0],
      customer: r.coords[r.coords.length - 1],
      address: dest.name,
      route1: r.coords.slice(0, mid + 1),
      route2: r.coords.slice(mid)
    });
  }
  console.log(JSON.stringify(routes, null, 2));
}

run();
