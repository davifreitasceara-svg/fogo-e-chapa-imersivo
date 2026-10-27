// Pontos de entrega reais em Fortaleza/CE usados no checkout e no GPS do motoboy.
// As coordenadas são aproximadas da portaria/entrada principal de cada local;
// o roteamento real (OSRM) "encaixa" o ponto na rua mais próxima.

export type LatLng = [number, number];

export interface DeliveryPoint {
  id: string;
  title: string;
  emoji: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  badge?: string;
  keywords: string[];
  coords: LatLng;
}

/** Localização da Hamburgueria Fogo & Chapa (ponto de coleta do motoboy). */
export const RESTAURANT_COORDS: LatLng = [-3.754824, -38.549215];

export const DELIVERY_POINTS: DeliveryPoint[] = [
  {
    id: "sesi-senai-parangaba",
    title: "SESI SENAI Parangaba",
    emoji: "🏫",
    address: "Av. João Pessoa",
    number: "6754",
    complement: "SESI SENAI Parangaba",
    neighborhood: "Parangaba",
    badge: "Escola Técnica",
    keywords: ["sesi", "senai", "parangaba", "joao pessoa", "joão pessoa", "6754"],
    coords: [-3.769087, -38.562593],
  },
  {
    id: "shopping-parangaba",
    title: "Shopping Parangaba",
    emoji: "🛍️",
    address: "Rua Germano Franck",
    number: "300",
    complement: "Shopping Parangaba",
    neighborhood: "Parangaba",
    badge: "Shopping",
    keywords: ["shopping parangaba", "germano franck", "parangaba", "terminal"],
    coords: [-3.775, -38.5636],
  },
  {
    id: "ufc-benfica",
    title: "UFC Reitoria (Benfica)",
    emoji: "🎓",
    address: "Av. da Universidade",
    number: "2853",
    complement: "UFC Reitoria",
    neighborhood: "Benfica",
    badge: "Universidade",
    keywords: ["ufc", "reitoria", "universidade", "benfica", "federal"],
    coords: [-3.7414, -38.5393],
  },
  {
    id: "ifce-fortaleza",
    title: "IFCE Campus Fortaleza",
    emoji: "🎓",
    address: "Av. 13 de Maio",
    number: "2081",
    complement: "IFCE",
    neighborhood: "Benfica",
    badge: "Instituto Federal",
    keywords: ["ifce", "instituto federal", "13 de maio", "treze de maio", "benfica"],
    coords: [-3.7447, -38.5358],
  },
  {
    id: "shopping-benfica",
    title: "Shopping Benfica",
    emoji: "🛍️",
    address: "Av. Carapinima",
    number: "2200",
    complement: "Shopping Benfica",
    neighborhood: "Benfica",
    badge: "Shopping",
    keywords: ["shopping benfica", "carapinima", "benfica"],
    coords: [-3.7405, -38.5404],
  },
  {
    id: "uece-itaperi",
    title: "UECE Campus Itaperi",
    emoji: "🎓",
    address: "Av. Dr. Silas Munguba",
    number: "1700",
    complement: "UECE",
    neighborhood: "Itaperi",
    badge: "Universidade",
    keywords: ["uece", "itaperi", "silas munguba", "estadual"],
    coords: [-3.7905, -38.5536],
  },
  {
    id: "ufc-pici",
    title: "UFC Campus do Pici",
    emoji: "🎓",
    address: "Av. Humberto Monte",
    number: "s/n",
    complement: "Campus do Pici",
    neighborhood: "Pici",
    badge: "Universidade",
    keywords: ["pici", "ufc pici", "humberto monte", "campus"],
    coords: [-3.7437, -38.5745],
  },
  {
    id: "north-shopping",
    title: "North Shopping Fortaleza",
    emoji: "🛍️",
    address: "Av. Bezerra de Menezes",
    number: "2450",
    complement: "North Shopping",
    neighborhood: "São Gerardo",
    badge: "Shopping",
    keywords: ["north shopping", "bezerra de menezes", "sao gerardo", "são gerardo"],
    coords: [-3.7354, -38.5667],
  },
  {
    id: "rodoviaria",
    title: "Rodoviária Engenheiro João Thomé",
    emoji: "🚌",
    address: "Av. Borges de Melo",
    number: "1630",
    complement: "Rodoviária",
    neighborhood: "Fátima",
    badge: "Terminal",
    keywords: ["rodoviaria", "rodoviária", "borges de melo", "fatima", "fátima", "onibus"],
    coords: [-3.7548, -38.5331],
  },
  {
    id: "aeroporto",
    title: "Aeroporto Pinto Martins",
    emoji: "✈️",
    address: "Av. Senador Carlos Jereissati",
    number: "3000",
    complement: "Saguão de Desembarque",
    neighborhood: "Serrinha",
    badge: "Aeroporto",
    keywords: ["aeroporto", "pinto martins", "jereissati", "serrinha", "voo"],
    coords: [-3.7765, -38.5327],
  },
  {
    id: "castelao",
    title: "Arena Castelão",
    emoji: "🏟️",
    address: "Av. Alberto Craveiro",
    number: "2901",
    complement: "Arena Castelão",
    neighborhood: "Castelão",
    badge: "Estádio",
    keywords: ["castelao", "castelão", "arena", "estadio", "estádio", "alberto craveiro"],
    coords: [-3.8072, -38.5224],
  },
  {
    id: "dragao-do-mar",
    title: "Dragão do Mar",
    emoji: "🎭",
    address: "Rua Dragão do Mar",
    number: "81",
    complement: "Centro Cultural",
    neighborhood: "Praia de Iracema",
    badge: "Cultura",
    keywords: ["dragao do mar", "dragão do mar", "praia de iracema", "centro cultural"],
    coords: [-3.7226, -38.5204],
  },
  {
    id: "beira-mar",
    title: "Av. Beira Mar (Feirinha)",
    emoji: "🌊",
    address: "Av. Beira Mar",
    number: "3120",
    complement: "Feirinha da Beira Mar",
    neighborhood: "Meireles",
    badge: "Orla",
    keywords: ["beira mar", "meireles", "orla", "praia", "feirinha"],
    coords: [-3.7252, -38.4976],
  },
  {
    id: "riomar",
    title: "Shopping RioMar Fortaleza",
    emoji: "🛍️",
    address: "Rua Desembargador Lauro Nogueira",
    number: "1500",
    complement: "RioMar",
    neighborhood: "Papicu",
    badge: "Shopping",
    keywords: ["riomar", "rio mar", "papicu", "lauro nogueira"],
    coords: [-3.7352, -38.4878],
  },
  {
    id: "iguatemi",
    title: "Iguatemi Bosque",
    emoji: "🛍️",
    address: "Av. Washington Soares",
    number: "85",
    complement: "Iguatemi Bosque",
    neighborhood: "Edson Queiroz",
    badge: "Shopping",
    keywords: ["iguatemi", "washington soares", "edson queiroz", "bosque"],
    coords: [-3.7546, -38.4889],
  },
  {
    id: "unifor",
    title: "Universidade de Fortaleza (Unifor)",
    emoji: "🎓",
    address: "Av. Washington Soares",
    number: "1321",
    complement: "Unifor",
    neighborhood: "Edson Queiroz",
    badge: "Universidade",
    keywords: ["unifor", "universidade de fortaleza", "washington soares", "edson queiroz"],
    coords: [-3.7689, -38.4782],
  },
];

/** Normaliza texto (minúsculo, sem acentos) para comparação. */
export const normalizeText = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Tenta identificar um ponto de entrega conhecido a partir de um texto de endereço. */
export function findDeliveryPointByText(text: string): DeliveryPoint | undefined {
  const t = normalizeText(text || "");
  if (!t) return undefined;
  // 1. Título exato contido no texto ou texto contido no título
  const byTitle = DELIVERY_POINTS.find(
    (p) => t.includes(normalizeText(p.title)) || normalizeText(p.title).includes(t),
  );
  if (byTitle) return byTitle;
  // 2. Keywords
  const byKeyword = DELIVERY_POINTS.find(
    (p) =>
      p.keywords &&
      p.keywords.some((k) => {
        const nk = normalizeText(k);
        return t.includes(nk) || (t.length >= 4 && nk.includes(t));
      }),
  );
  if (byKeyword) return byKeyword;
  // 3. Rua + número
  const byStreet = DELIVERY_POINTS.find(
    (p) => t.includes(normalizeText(p.address)) && p.number !== "s/n" && t.includes(p.number),
  );
  if (byStreet) return byStreet;
  // 4. Complemento
  const byComplement = DELIVERY_POINTS.find((p) => {
    const comp = normalizeText(p.complement);
    return comp && (t.includes(comp) || comp.includes(t));
  });
  if (byComplement) return byComplement;

  return undefined;
}

/** Extrai um título legível e amigável do destino para o cabeçalho e telemetria do GPS. */
export function getDestinationTitle(address?: string, coords?: LatLng | null): string {
  if (coords) {
    const byCoords = DELIVERY_POINTS.find(
      (p) =>
        Math.abs(p.coords[0] - coords[0]) < 0.003 &&
        Math.abs(p.coords[1] - coords[1]) < 0.003,
    );
    if (byCoords) return byCoords.title;
  }
  if (!address || !address.trim()) return "Seu Endereço";
  const matched = findDeliveryPointByText(address);
  if (matched) return matched.title;
  const parts = address.split(/[•|,|-]/);
  const first = parts[0]?.trim();
  if (first && first.length > 2) {
    return first;
  }
  return address.trim();
}

/**
 * Busca a rota real de condução pelas ruas de Fortaleza usando OSRM com fallback suave.
 */
export async function fetchRealRoute(start: LatLng, end: LatLng): Promise<LatLng[]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4500);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes[0]?.geometry?.coordinates?.length) {
        // Converte [lon, lat] do GeoJSON para [lat, lon] do Leaflet
        return data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);
      }
    }
  } catch (e) {
    // Falha silenciosa, usa interpolação suave de fallback
  }

  // Fallback: interpola 16 pontos suaves entre origem e destino
  const steps = 16;
  const pts: LatLng[] = [];
  for (let i = 0; i <= steps; i++) {
    const factor = i / steps;
    pts.push([
      start[0] + (end[0] - start[0]) * factor,
      start[1] + (end[1] - start[1]) * factor,
    ]);
  }
  return pts;
}

