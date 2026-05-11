import React from 'react';
import EditorialHero from '../../components/EditorialHero';
import { productAssetImages } from '../../lib/localImages';

const CartHeader = ({ itemCount = 0, total = 0 }) => {
  return (
    <EditorialHero
      eyebrow="Shopping Bag"
      title="Your Shopping"
      italic="Bag"
      copy="Review selected plants, tools, and gifts before checkout. Quantity edits update totals immediately."
      image={productAssetImages.wateringCan}
      imageAlt="Plant care watering can"
      meta={[
        { label: 'Items', value: itemCount.toString().padStart(2, '0') },
        { label: 'Subtotal', value: `Rs ${Number(total || 0).toLocaleString('en-NP')}` },
      ]}
    />
  );
};

export default CartHeader;
