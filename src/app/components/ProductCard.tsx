"use client";
import AddToCart from "@/app/components/AddToCart";

const ProductCard = () => {
  return (
    <div className={'flex flex-start'}>
      <div className="card rounded-lg border-4 p-2 border-[#dedede]">
        <h1>Product Card</h1>
        <AddToCart />
      </div>
    </div>
  );
};
export default ProductCard;
