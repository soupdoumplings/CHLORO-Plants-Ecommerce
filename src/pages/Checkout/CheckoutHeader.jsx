import React from 'react';
import EditorialHero from '../../components/EditorialHero';
import { productAssetImages } from '../../lib/localImages';

const CheckoutHeader = () => {
  return (
    <EditorialHero
      eyebrow="Secure Checkout"
      title="Complete Your"
      italic="Order"
      copy="Confirm delivery, billing, and payment details in one calm pass. Saved profile details are prefilled when available."
      image={productAssetImages.vessel}
      imageAlt="Ceramic planter"
      meta={[
        { label: 'Fulfillment', value: 'Nepal Delivery' },
        { label: 'Payment', value: 'Wallet / COD' },
      ]}
    />
  );
};

export default CheckoutHeader;
