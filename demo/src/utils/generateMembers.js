// Generate HiLumi M.C. member data with realistic geographic distribution

// Major physics labs and their coordinates
const PHYSICS_LABS = [
  { name: 'CERN', lat: 46.2333, lon: 6.0557, weight: 500 },
  { name: 'Fermilab', lat: 41.8314, lon: -88.2565, weight: 80 },
  { name: 'SLAC', lat: 37.4175, lon: -122.2054, weight: 60 },
  { name: 'KEK', lat: 36.1455, lon: 140.0764, weight: 70 },
  { name: 'DESY', lat: 53.5753, lon: 9.8779, weight: 65 },
  { name: 'Brookhaven', lat: 40.8720, lon: -72.8870, weight: 45 },
  { name: 'TRIUMF', lat: 49.2488, lon: -123.2328, weight: 30 },
  { name: 'INFN Frascati', lat: 41.8102, lon: 12.6750, weight: 40 },
  { name: 'IHEP Beijing', lat: 39.9042, lon: 116.4074, weight: 50 },
  { name: 'RAL', lat: 51.5710, lon: -1.3149, weight: 35 },
  { name: 'LAPP Annecy', lat: 45.8992, lon: 6.1294, weight: 25 },
  { name: 'ETH Zürich', lat: 47.3769, lon: 8.5417, weight: 40 },
  { name: 'LPNHE Paris', lat: 48.8566, lon: 2.3522, weight: 30 },
  { name: 'Nikhef', lat: 52.3547, lon: 4.9517, weight: 25 },
];

// First names pool
const FIRST_NAMES = [
  'Emma', 'Liam', 'Sofia', 'Noah', 'Olivia', 'Lucas', 'Ava', 'Oliver', 'Isabella', 'Elijah',
  'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Alexander', 'Harper', 'Michael', 'Evelyn', 'William',
  'Maja', 'Klaus', 'Ingrid', 'Lars', 'Astrid', 'Hans', 'Karin', 'Erik', 'Sven', 'Anna',
  'Pierre', 'Marie', 'Jean', 'Sophie', 'Antoine', 'Camille', 'Marco', 'Giulia', 'Paolo', 'Francesca',
  'Yuki', 'Kenji', 'Hana', 'Akira', 'Wei', 'Li', 'Chen', 'Ming', 'Raj', 'Priya',
];

// Last names pool
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Petersen', 'Hansen', 'Nielsen', 'Jensen', 'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer',
  'Dubois', 'Martin', 'Bernard', 'Thomas', 'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano',
  'Tanaka', 'Suzuki', 'Takahashi', 'Watanabe', 'Wang', 'Li', 'Zhang', 'Liu', 'Kumar', 'Singh',
];

// Seeded random number generator for reproducibility
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Normal distribution (Box-Muller transform)
function randomNormal(rng, mean = 0, std = 1) {
  const u1 = rng.next();
  const u2 = rng.next();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z0 * std;
}

// Log-normal distribution
function randomLogNormal(rng, median, spread) {
  const normal = randomNormal(rng, 0, 1);
  return median * Math.exp(normal * spread);
}

// Calculate distance between two lat/lon points (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate members
export function generateMembers(totalMembers = 1247, seed = 42) {
  const rng = new SeededRandom(seed);
  const members = [];
  
  // Calculate total weight
  const totalWeight = PHYSICS_LABS.reduce((sum, lab) => sum + lab.weight, 0);
  
  for (let i = 0; i < totalMembers; i++) {
    // Select a lab based on weights
    let random = rng.next() * totalWeight;
    let selectedLab = PHYSICS_LABS[0];
    
    for (const lab of PHYSICS_LABS) {
      random -= lab.weight;
      if (random <= 0) {
        selectedLab = lab;
        break;
      }
    }
    
    // Generate position near the selected lab
    // Closer labs (higher weight) have tighter clustering
    const clusterTightness = 0.3 / Math.sqrt(selectedLab.weight / 100);
    const lat = randomNormal(rng, selectedLab.lat, clusterTightness);
    const lon = randomNormal(rng, selectedLab.lon, clusterTightness);
    
    // Generate name
    const firstName = FIRST_NAMES[Math.floor(rng.next() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng.next() * LAST_NAMES.length)];
    
    // Generate credits (log-normal distribution, median ~5000)
    const credits = Math.floor(randomLogNormal(rng, 5000, 0.8));
    
    // Generate storage (log-normal distribution, median ~2 TB)
    const storage_tb = parseFloat(randomLogNormal(rng, 2, 0.6).toFixed(2));
    
    // Generate compute hours (correlated with credits)
    const compute_hours = Math.floor(credits * (0.5 + rng.next() * 0.5));
    
    // Some members have institutional affiliation
    const hasInstitution = rng.next() > 0.3;
    const institution = hasInstitution ? selectedLab.name : null;
    
    members.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      lat,
      lon,
      credits,
      storage_tb,
      compute_hours,
      institution,
    });
  }
  
  return members;
}

// Calculate distance from ATLAS (at CERN)
export function getMembersNearATLAS(members, maxDistanceKm = 50) {
  const ATLAS_LAT = 46.2333;
  const ATLAS_LON = 6.0557;
  
  return members
    .map(member => ({
      ...member,
      distance: calculateDistance(ATLAS_LAT, ATLAS_LON, member.lat, member.lon)
    }))
    .filter(member => member.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance);
}

// Calculate angle (theta) from CERN center for a given member
// Returns angle in degrees (0 = East, 90 = North, 180 = West, 270 = South)
function calculateAngleFromCERN(lat, lon) {
  const CERN_LAT = 46.2333;
  const CERN_LON = 6.0557;
  
  const dLat = lat - CERN_LAT;
  const dLon = lon - CERN_LON;
  
  // Calculate angle in radians, then convert to degrees
  let theta = Math.atan2(dLat, dLon) * 180 / Math.PI;
  
  // Normalize to 0-360 range (0 = East, 90 = North)
  theta = (theta + 360) % 360;
  
  return theta;
}

// Filter members by angular sector around CERN
export function getMembersByAngularSector(members, minAngle, maxAngle, maxDistanceKm = null) {
  const CERN_LAT = 46.2333;
  const CERN_LON = 6.0557;
  
  return members
    .map(member => {
      const distance = calculateDistance(CERN_LAT, CERN_LON, member.lat, member.lon);
      const angle = calculateAngleFromCERN(member.lat, member.lon);
      
      return {
        ...member,
        distance,
        angle
      };
    })
    .filter(member => {
      // Check distance constraint if provided
      if (maxDistanceKm !== null && member.distance > maxDistanceKm) {
        return false;
      }
      
      // Check angular sector
      // Handle wraparound case (e.g., 350-10 degrees)
      if (minAngle <= maxAngle) {
        return member.angle >= minAngle && member.angle <= maxAngle;
      } else {
        return member.angle >= minAngle || member.angle <= maxAngle;
      }
    })
    .sort((a, b) => a.distance - b.distance);
}
