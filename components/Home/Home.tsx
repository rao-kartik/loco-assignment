'use client';
import { fetchImagesApi } from '@/app/api';
import React, { memo, use, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

/* Lazy Components */
const Lightbox = dynamic(() => import('./Lightbox/Lightbox'));

/* Interfaces */
import { IPage } from '@/app/apiInterfaces';
interface IHome {
	images: any;
}
interface IImageLightbox {
	open: boolean;
	currentImage: any;
}

const Home = (props: IHome) => {
	const { images: initialImages } = props;

	const [images, setImages] = useState(initialImages);
	const [pageDetails, setPageDetails] = useState<IPage>({
		page: 1,
		per_page: 20,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [imageLightbox, setImageLightbox] = useState<IImageLightbox | null>(null);

	const dataLoading = useRef<boolean>(false);
	const refetchTries = useRef<any>({});

	/* Opening the lightbox */
	const handleOpenLightBox: any = useCallback(
		(imageData: any, idx: number) => () => {
			setImageLightbox((prev) => {
				console.log(prev);

				return prev?.currentImage?.id !== imageData?.id ? { open: true, currentImage: { idx, ...imageData } } : prev;
			});
		},
		[]
	);

	/* Closing lightbox */
	const onLightboxClose: any = useCallback(() => {
		setImageLightbox(null);
	}, []);

	/* Fetching more images */
	const handleFetchMoreImages = useCallback(
		async (callback: any) => {
			try {
				dataLoading.current = true;
				setIsLoading(true); // enabling loader

				// updating the page number
				setPageDetails((prev: IPage) => ({
					...pageDetails,
					page: prev.page + 1,
				}));

				// Fetching more images
				const moreImages = await fetchImagesApi({
					...pageDetails,
					page: pageDetails.page + 1,
				});

				// If there are more images
				if (moreImages?.length > 0) {
					setImages((prev: any) => {
						const updatedImages = [...prev, ...moreImages];

						if (typeof callback === 'function') {
							callback(updatedImages);
						}

						return updatedImages;
					}); // adding to existing images
				}

				dataLoading.current = false;
				setIsLoading(false);
			} catch (err) {
				dataLoading.current = false;
				setIsLoading(false);
				setPageDetails((prev: IPage) => ({
					...pageDetails,
					page: prev.page - 1,
				}));
			}
		},
		[pageDetails?.page]
	);

	/* Function to go to previous image in lightbox */
	const goToPrevImg = useCallback(() => {
		setImageLightbox((prev) => {
			if (prev?.currentImage?.idx && prev?.currentImage?.idx > 0) {
				const currentImgIdx = prev?.currentImage?.idx;
				const prevImgIdx = currentImgIdx - 1;
				const prevImageDetails = images?.[prevImgIdx];

				return {
					...prev,
					currentImage: {
						idx: prevImgIdx,
						...prevImageDetails,
					},
				};
			}

			return prev;
		});
	}, [images]);

	const setNextData = useCallback((paramImages: any) => {
		setImageLightbox((prev) => {
			if (typeof prev?.currentImage?.idx !== 'undefined') {
				const currentImgIdx = prev?.currentImage?.idx;
				const nextImgIdx = currentImgIdx + 1;
				const nextImageDetails = paramImages?.[nextImgIdx];

				return {
					...prev,
					currentImage: {
						idx: nextImgIdx,
						...nextImageDetails,
					},
				};
			}

			return prev;
		});
	}, []);

	/* Function to go to next image in lightbox */
	const goToNextImg = () => {
		if (typeof imageLightbox?.currentImage?.idx !== 'undefined') {
			const currentImgIdx: number = imageLightbox?.currentImage?.idx;
			const nextImgIdx = currentImgIdx + 1;

			if (nextImgIdx === images?.length) {
				handleFetchMoreImages(setNextData);
			} else {
				setNextData(images);
			}
		}
	};

	/* Function for fetcing more image on scrolling */
	const handleScroll = useCallback(() => {
		if (
			window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 50 ||
			dataLoading?.current ||
			isLoading ||
			refetchTries?.current?.[pageDetails.page] > 3 // allowning 3 retries if api fails
		) {

      // resetting refetch tries
			if (refetchTries?.current?.[pageDetails.page] > 3) {
				refetchTries.current = {
					...refetchTries.current,
					[pageDetails.page]: 0,
				};
			}

			return;
		}

    // refetched entries
		refetchTries.current = {
			...refetchTries.current,
			[pageDetails.page]: refetchTries?.current?.[pageDetails.page] + 1 || 1,
		};

		handleFetchMoreImages(null);
	}, [handleFetchMoreImages, isLoading]);

	/* Scrolling window to top on page load */
	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0);
		}
	}, []);

	/* Attaching on scroll listener for infinite scrolling */
	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [pageDetails, isLoading]);

	return (
		<>
			<div className='container mx-auto p-4'>
				<div className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{images?.map((image: any, idx: number) => {
						return (
							<button
								type='button'
								key={image?.id}
								className='w-full aspect-auto relative overflow-hidden rounded-lg'
								onClick={handleOpenLightBox(image, idx)}
							>
								<img
									src={image?.urls?.regular}
									alt={image?.alt_description}
									className='size-full rounded-lg object-cover'
								/>
							</button>
						);
					})}
				</div>
			</div>

			{isLoading && (
				<div className='animate-spin size-5 sm:size-6 md:size-7 lg:size-8 rounded-full border-4 border-gray-200 border-t-blue-500 m-auto mb-4'></div>
			)}

			{imageLightbox?.open && (
				<Lightbox
					open={imageLightbox?.open || false}
					onClose={onLightboxClose}
					currentImageData={imageLightbox?.currentImage}
					prevDisabled={imageLightbox?.currentImage?.idx === 0}
					onPrev={goToPrevImg}
					onNext={goToNextImg}
					isLoading={isLoading}
				/>
			)}
		</>
	);
};

export default memo(Home);
