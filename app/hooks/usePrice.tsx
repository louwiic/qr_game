const usePrice = () => {
  const localPrice = (price, local = 'fr-FR') => {
    //let priceConverted = Number((price / 100).toFixed(1));

    const intlPrice = new Intl.NumberFormat(local, {
      style: 'currency',
      currency: 'EUR',
    }).format(Number((price / 100).toFixed(2)));
    return intlPrice;
  };

  return {
    localPrice,
  };
};
export default usePrice;
