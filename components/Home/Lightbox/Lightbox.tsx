import React, { memo } from "react";
import { createPortal } from "react-dom";

/* Interfaces */
import { ILightbox } from "./LightboxInterfaces";
import CloseIcon from "@/Icons/CloseIcon";
import NextArrowIcon from "@/Icons/NextArrowIcon";

const Lightbox = (props: ILightbox) => {
  const {
    open,
    onClose,
    currentImageData,
    onNext,
    onPrev,
    prevDisabled,
    isLoading,
  } = props;

  return (
    open &&
    createPortal(
      <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center">
        <div
          className="size-full bg-gray-400 opacity-50 absolute top-0 left-0"
          onClick={onClose}
        ></div>

        <div className="size-full z-2 relative bg-white rounded-lg overflow-hidden flex flex-col">
          <div className="py-4 px-5 flex items-center justify-between shadow-sm gap-4">
            <div className="flex-1 overflow-hidden relative max-w-full">
              <h3 className="text-[#363636] text-base font-bold truncate">
                {currentImageData?.alt_description}
              </h3>

              <p className="text-[xs] text-gray-400 truncate">
                Uploaded By:{" "}
                <span className="font-semibold">
                  {currentImageData?.user?.name}
                </span>
              </p>
            </div>

            <button onClick={onClose}>
              <CloseIcon className="size-4 min-w-4 text=[#0F0F0F]" />
            </button>
          </div>

          {isLoading ? (
            <div className="size-full flex items-center justify-center">
              <div className="animate-spin size-5 sm:size-6 md:size-7 lg:size-8 rounded-full border-4 border-gray-200 border-t-blue-500 m-auto mb-4"></div>
            </div>
          ) : (
            <div className="flex-1 relative overflow-hidden">
              <button
                className="rotate-180 absolute top-1/2 left-4 md:left:6 disabled:cursor-not-allowed disabled:opacity-50 -translate-y-1/2 bg-[#c0c0c0] rounded-full p-2"
                disabled={prevDisabled}
                onClick={onPrev}
              >
                <NextArrowIcon className="size-3 text-[#ffffff]" />
              </button>

              {currentImageData.urls?.full && <img
                className="size-full object-contain"
                src={currentImageData.urls?.full}
              />}

              <button
                className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 bg-[#c0c0c0] rounded-full p-2"
                onClick={onNext}
              >
                <NextArrowIcon className="size-3 text-[#ffffff]" />
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  );
};

export default memo(Lightbox);
