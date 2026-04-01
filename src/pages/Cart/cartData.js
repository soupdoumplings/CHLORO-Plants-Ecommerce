import vessel from '../../assets/products/vessel.png';
import wateringCan from '../../assets/products/watering-can.png';
import scissors from '../../assets/products/scissors.png'; // for cross-sell

export const initialCartItems = [
  {
    id: 'prod_01',
    name: 'The Heritage Planter',
    variant: 'SANDSTONE • LARGE',
    price: 185.00,
    quantity: 1,
    image: vessel,
  },
  {
    id: 'prod_02',
    name: 'Veridian Mist Bottle',
    variant: 'SMOKED GLASS • BRASS TRIM',
    price: 42.00,
    quantity: 2,
    image: wateringCan,
  },
];

export const crossSellProduct = {
  id: 'prod_cross',
  name: 'Botanical Growth Serum',
  description: 'The essential companion for your Heritage Planter. A cold-pressed organic nutrient blend designed for indoor specimens.',
  price: 28.00,
  image: scissors, // using placeholder image
};
