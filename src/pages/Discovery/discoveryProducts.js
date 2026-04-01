import lycasteImg from '../../assets/products/lycaste.png';
import vesselImg from '../../assets/products/vessel.png';
import proteaImg from '../../assets/products/protea.png';
import succulentsImg from '../../assets/products/succulents.png';
import scissorsImg from '../../assets/products/scissors.png';
import monsteraImg from '../../assets/products/monstera.png';
import wateringCanImg from '../../assets/products/watering-can.png';
import terrariumImg from '../../assets/products/terrarium.png';

const discoveryProducts = [
  {
    id: 'lycaste-granata',
    name: 'Lycaste Granata',
    price: 'रू 240.00',
    category: 'Rare Foliage',
    image: lycasteImg,
    badge: 'Limited Edition',
    aspect: 'square',   // 1:1
  },
  {
    id: 'etone-vessel',
    name: 'Etone Vessel',
    price: 'रू 185.00',
    category: 'Studio Ceramics',
    image: vesselImg,
    badge: null,
    aspect: 'portrait', // 4:5
  },
  {
    id: 'wild-king-protea',
    name: 'Wild King Protea',
    price: 'रू 45.00',
    category: 'Fresh Cut',
    image: proteaImg,
    badge: null,
    aspect: 'tall',     // 3:5
  },
  {
    id: 'obtusa-trio',
    name: 'Obtusa Trio',
    price: 'रू 72.00',
    category: 'Succulents',
    image: succulentsImg,
    badge: null,
    aspect: 'square',
  },
  {
    id: 'brass-secateurs',
    name: 'Brass Secateurs',
    price: 'रू 120.00',
    category: 'Heirloom Tools',
    image: scissorsImg,
    badge: null,
    aspect: 'portrait',
  },
  {
    id: 'deliciosa-shadow',
    name: "Deliciosa 'Shadow'",
    price: 'रू 145.00',
    category: 'Large Scale',
    image: monsteraImg,
    badge: null,
    aspect: 'square',
  },
  {
    id: 'mineral-can',
    name: 'Mineral Can',
    price: 'रू 130.00',
    category: 'Copperware',
    image: wateringCanImg,
    badge: null,
    aspect: 'portrait',
  },
  {
    id: 'orb-biosphere',
    name: 'Orb Biosphere',
    price: 'रू 320.00',
    category: 'Living Ecosystem',
    image: terrariumImg,
    badge: null,
    aspect: 'tall',
  },
];

export default discoveryProducts;
