"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { addItemToCart } from "@/state/features/product/cart-slice";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import isObjectWithProperties from "@/utils/IsObjectWithProperties";
import isArrayWithElements from "@/utils/IsArrayWithElements";
import {
  SuccessMessage,
  FailureMessage,
} from "@/state/features/notification/productAddedToCartOrWishlistNotification";
import { MagnifyImage } from "@/types/MagnifyImage";
import {
  addWishListProductRequest,
  deleteWishlistProductRequest,
} from "@/state/features/wishlist/wishlist-slice";
import DynamicRating from "./product-rating/DynamicRating";
import { getProductImage } from "@/utils/Endpoint";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  // const [quantity, setQuantity] = useState(1);
  const [hoverData, setHoverData] = useState<MagnifyImage | null>(null);

  const dispatch = useAppDispatch();
  const quickViewItem = useAppSelector((state) => state?.quickView?.products);
  const wishListItems = useAppSelector((state) => state?.wishlist);
  const wishListProducts = useAppSelector((state) => state.wishlist.products);

  const [activePreview, setActivePreview] = useState(0);
  // add to cart
  const handleAddToCart = () => {
    if (!quickViewItem?.id) {
      console.error("Item ID is missing");
    } else if (isObjectWithProperties(quickViewItem)) {
      // here we can get the selected image is at index  activePreview
      const productImage = quickViewItem.ProductImage?.[activePreview];
      // here let also find the productr variation
      const variation = quickViewItem?.ProductVariation.find(
        (variation) => variation?.productImageId === productImage?.id,
      );
      dispatch(
        addItemToCart({
          ...quickViewItem,
          ProductImage: [productImage],
          ProductVariation: variation ? [variation] : [],
          quantity: 1,
        }),
      );
      dispatch(
        SuccessMessage({
          message: "Product added to cart!",
          success: "succeeded",
        }),
      );
      closeModal();
    } else {
      dispatch(
        FailureMessage({ message: "Product not found!", success: "failed" }),
      );
    }
  };

  // let's  control the close  the quick modal
  useEffect(() => {
    if (wishListItems.success === "succeeded") {
      closeModal(); // Ensure modal is closed when wishListItems.success === succeeded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishListItems.success]);

  const isInsideWishListAvailable = useMemo(() => {
    return wishListProducts.some(
      (wishListProduct) => wishListProduct?.product?.id === quickViewItem?.id,
    );
  }, [wishListProducts, quickViewItem?.id]);

  const handlAddToWishlist = async () => {
    if (!quickViewItem?.id) {
      console.error("Item ID is missing");
    }
    // here let us check the product first
    // closeModal();
    else if (
      isObjectWithProperties(quickViewItem) &&
      !isInsideWishListAvailable
    ) {
      // here we can get the selected image is at index  activePreview
      const productImage = quickViewItem.ProductImage?.[activePreview];
      // here let also find the productr variation
      const variation = quickViewItem.ProductVariation.find(
        (variation) => variation.productImageId === productImage.id,
      );
      dispatch(
        addWishListProductRequest({
          product: quickViewItem,
          productId: quickViewItem.id,
          variationId: variation?.id,
        }),
      );
    } else if (
      isObjectWithProperties(quickViewItem) &&
      isInsideWishListAvailable
    ) {
      const productId = quickViewItem?.id;
      const wishListItem = wishListProducts.find(
        (wishList) => wishList?.product?.id === productId,
      );
      const wishListItemId = wishListItem?.wishListItemId;
      // Remove from wishlist if already in wishlist
      if (wishListItemId) {
        dispatch(deleteWishlistProductRequest(wishListItemId));
      }
    } else {
      dispatch(
        FailureMessage({ message: "Product not found!", success: "failed" }),
      );
    }
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null; // Type assertion to HTMLElement
      if (target && !target.closest(".modal-content")) {
        closeModal();
        setActivePreview(0);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      // setQuantity(1); // to reset quantity to 1
    };
  }, [isModalOpen, closeModal]);

  const handlCloseModal = () => {
    setActivePreview(0); // to reset the image index to 0
    closeModal();
  };

  const handleMouseMove = (e: React.MouseEvent, imageSrc: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // Percentage X
    const y = ((e.clientY - rect.top) / rect.height) * 100; // Percentage Y

    setHoverData({
      src: imageSrc,
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div
      className={`${
        isModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={() => handlCloseModal()}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div className="flex flex-wrap items-center gap-12.5">
            <div className="max-w-[526px] w-full">
              <div className="flex gap-5">
                <div className="flex flex-col gap-5">
                  {isObjectWithProperties(quickViewItem) &&
                    isArrayWithElements(quickViewItem?.ProductImage) &&
                    quickViewItem?.ProductImage?.map((img, key) => (
                      <button
                        onMouseEnter={() => setActivePreview(key)}
                        key={img?.id || key}
                        className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-1 ease-out duration-200 hover:border-2 hover:border-blue ${
                          activePreview === key && "border-2 border-blue"
                        }`}
                      >
                        <Image
                          src={
                            `${process.env.NEXT_PUBLIC_BACK_END_BASE_URL}${getProductImage(img?.url) ?? ""}`
                            // img?.url ||
                            // "/images/placeholder/default-product.png"
                          }
                          alt="thumbnail"
                          width={61}
                          height={61}
                          className="aspect-square"
                        />
                      </button>
                    ))}
                </div>

                <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                  <div>
                    {isObjectWithProperties(quickViewItem) &&
                    isArrayWithElements(quickViewItem?.ProductImage) ? (
                      <div
                        onMouseMove={(e) =>
                          handleMouseMove(
                            e,
                            quickViewItem?.ProductImage?.[activePreview]?.url,
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <Image
                          src={
                            `${process.env.NEXT_PUBLIC_BACK_END_BASE_URL}${getProductImage(quickViewItem?.ProductImage?.[activePreview]?.url) ?? ""}`
                            // quickViewItem?.ProductImage?.[activePreview]?.url ||
                            // "/images/placeholder/default-product.png"
                          }
                          alt="product image"
                          width={400}
                          height={400}
                        />
                      </div>
                    ) : (
                      <span>No image available</span> // Or render a placeholder
                    )}
                  </div>
                </div>
                {hoverData && (
                  <div className="absolute lg:left-[550px] lg:top-0 top-[520px] left-0 ml-8 flex justify-center items-center z-999999">
                    <div
                      className=" w-125 h-[508px]  overflow-hidden border border-gray-300"
                      style={{
                        backgroundImage: `url(${hoverData.src})`,
                        backgroundSize: "180%", // Magnify by 2x
                        backgroundPosition: `${hoverData.x}% ${hoverData.y}%`,
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            <div className="max-w-[445px] w-full">
              <span className="inline-block text-custom-xs font-medium text-white py-1 px-3 bg-primary mb-6.5">
                SALE 10% OFF
              </span>

              <h3 className="font-semibold text-xl xl:text-heading-5 text-dark mb-4">
                {quickViewItem?.name}
              </h3>

              <div className="flex flex-wrap items-center gap-5 mb-6">
                <div className="flex items-center gap-1.5">
                  {/* <!-- stars --> */}
                  <DynamicRating
                    rating={quickViewItem?.ratings ?? 0}
                    views={quickViewItem?.totalRatings ?? 0}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_375_9221)">
                      <path
                        d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                        fill="#22AD5C"
                      />
                      <path
                        d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                        fill="#22AD5C"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_375_9221">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className="font-medium text-dark"> In Stock </span>
                </div>
              </div>

              <p>{quickViewItem?.description ?? ""}</p>

              <div className="flex flex-wrap justify-between gap-5 mt-6 mb-7.5">
                <div>
                  <h4 className="font-semibold text-lg text-dark mb-3.5">
                    Price
                  </h4>

                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-dark text-xl xl:text-heading-4">
                      ${quickViewItem?.basePrice}
                    </span>
                    {/* <span className="font-medium text-dark-4 text-lg xl:text-2xl line-through">
                      ${quickViewItem?.basePrice}
                    </span> */}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleAddToCart()}
                  className={`inline-flex font-medium text-white bg-[#DBA400] py-3 px-7 rounded-md ease-out duration-200
                  `}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handlAddToWishlist()}
                  className={`inline-flex items-center gap-2 font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-95 `}
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.68698 3.68688C3.30449 4.31882 2.29169 5.82191 2.29169 7.6143C2.29169 9.44546 3.04103 10.8569 4.11526 12.0665C5.00062 13.0635 6.07238 13.8897 7.11763 14.6956C7.36588 14.8869 7.61265 15.0772 7.85506 15.2683C8.29342 15.6139 8.68445 15.9172 9.06136 16.1374C9.43847 16.3578 9.74202 16.4584 10 16.4584C10.258 16.4584 10.5616 16.3578 10.9387 16.1374C11.3156 15.9172 11.7066 15.6139 12.145 15.2683C12.3874 15.0772 12.6342 14.8869 12.8824 14.6956C13.9277 13.8897 14.9994 13.0635 15.8848 12.0665C16.959 10.8569 17.7084 9.44546 17.7084 7.6143C17.7084 5.82191 16.6955 4.31882 15.3131 3.68688C13.97 3.07295 12.1653 3.23553 10.4503 5.01733C10.3325 5.13974 10.1699 5.20891 10 5.20891C9.83012 5.20891 9.66754 5.13974 9.54972 5.01733C7.83474 3.23553 6.03008 3.07295 4.68698 3.68688ZM10 3.71573C8.07331 1.99192 5.91582 1.75077 4.16732 2.55002C2.32061 3.39415 1.04169 5.35424 1.04169 7.6143C1.04169 9.83557 1.9671 11.5301 3.18062 12.8966C4.15241 13.9908 5.34187 14.9067 6.39237 15.7155C6.63051 15.8989 6.8615 16.0767 7.0812 16.2499C7.50807 16.5864 7.96631 16.9453 8.43071 17.2166C8.8949 17.4879 9.42469 17.7084 10 17.7084C10.5754 17.7084 11.1051 17.4879 11.5693 17.2166C12.0337 16.9453 12.492 16.5864 12.9188 16.2499C13.1385 16.0767 13.3695 15.8989 13.6077 15.7155C14.6582 14.9067 15.8476 13.9908 16.8194 12.8966C18.0329 11.5301 18.9584 9.83557 18.9584 7.6143C18.9584 5.35424 17.6794 3.39415 15.8327 2.55002C14.0842 1.75077 11.9267 1.99192 10 3.71573Z"
                      fill=""
                    />
                  </svg>
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
