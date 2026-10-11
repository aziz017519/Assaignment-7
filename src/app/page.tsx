
import HeroBanner from "./components/HeroBanner";
import PriceUp from "./components/products/PriceUp";
import PriceDown from "./components/products/PriceDown";
import AllProductsDataFetch from "./components/products/AllProducts";

export default function Home() {
  return (
    <div>
      
      <HeroBanner></HeroBanner>
      <PriceUp></PriceUp>
      <PriceDown></PriceDown>
      <AllProductsDataFetch></AllProductsDataFetch>
    </div>
  );
}
