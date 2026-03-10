export interface OverpassBusiness {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  category: string;
  phone?: string;
  website?: string;
  hours?: string;
}

const BASE = "https://overpass-api.de/api/interpreter";

function buildQuery(query: string, lat: number, lng: number, radius: number): string {
  const term = query.toLowerCase();

  let filters: string[] = [];

  if (term.includes("restaurant") || term.includes("food")) {
    filters = ['["amenity"="restaurant"]', '["amenity"="fast_food"]'];
  } else if (term.includes("cafe") || term.includes("coffee")) {
    filters = ['["amenity"="cafe"]'];
  } else if (term.includes("bar") || term.includes("pub")) {
    filters = ['["amenity"="bar"]', '["amenity"="pub"]'];
  } else if (term.includes("hotel")) {
    filters = ['["tourism"="hotel"]'];
  } else if (term.includes("hospital") || term.includes("clinic") || term.includes("doctor")) {
    filters = ['["amenity"="hospital"]', '["amenity"="clinic"]', '["amenity"="doctors"]'];
  } else if (term.includes("pharmacy") || term.includes("drugstore")) {
    filters = ['["amenity"="pharmacy"]'];
  } else if (term.includes("gym") || term.includes("fitness")) {
    filters = ['["leisure"="fitness_centre"]', '["leisure"="sports_centre"]'];
  } else if (term.includes("shop") || term.includes("store") || term.includes("mall")) {
    filters = ['["shop"]'];
  } else if (term.includes("park")) {
    filters = ['["leisure"="park"]'];
  } else if (term.includes("school") || term.includes("university")) {
    filters = ['["amenity"="school"]', '["amenity"="university"]', '["amenity"="college"]'];
  } else if (term.includes("bank") || term.includes("atm")) {
    filters = ['["amenity"="bank"]', '["amenity"="atm"]'];
  } else if (term.includes("gas") || term.includes("petrol") || term.includes("fuel")) {
    filters = ['["amenity"="fuel"]'];
  } else {
    // Generic: any named amenity or shop
    filters = ['["name"]["amenity"]', '["name"]["shop"]', '["name"]["tourism"]'];
  }

  const nodeWayBlocks = filters
    .flatMap((f) => [`node${f}(around:${radius},${lat},${lng});`, `way${f}(around:${radius},${lat},${lng});`])
    .join("\n      ");

  return `[out:json][timeout:25];
(
  ${nodeWayBlocks}
);
out center 20;`;
}

function parseElement(el: any): OverpassBusiness | null {
  const tags = el.tags ?? {};
  const name = tags.name;
  if (!name) return null;

  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (!lat || !lng) return null;

  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");

  return {
    id: String(el.id),
    name,
    lat,
    lng,
    address: street,
    city: tags["addr:city"] ?? "",
    state: tags["addr:state"] ?? "",
    zip: tags["addr:postcode"] ?? "",
    country: tags["addr:country"] ?? "",
    category: tags.amenity ?? tags.shop ?? tags.tourism ?? tags.leisure ?? "business",
    phone: tags.phone ?? tags["contact:phone"],
    website: tags.website ?? tags["contact:website"],
    hours: tags.opening_hours,
  };
}

export async function searchOverpassBusinesses(
  query: string,
  lat: number,
  lng: number,
  radius = 5000
): Promise<OverpassBusiness[]> {
  const overpassQuery = buildQuery(query, lat, lng, radius);

  const res = await fetch(BASE, {
    method: "POST",
    body: overpassQuery,
    headers: { "Content-Type": "text/plain" },
  });

  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

  const data = await res.json();
  return (data.elements ?? [])
    .map(parseElement)
    .filter((b: OverpassBusiness | null): b is OverpassBusiness => b !== null)
    .slice(0, 20);
}

export async function getOverpassBusinessDetails(osmId: string): Promise<OverpassBusiness | null> {
  const query = `[out:json][timeout:10];
(
  node(${osmId});
  way(${osmId});
);
out center 1;`;

  const res = await fetch(BASE, {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const el = data.elements?.[0];
  if (!el) return null;

  return parseElement(el);
}
