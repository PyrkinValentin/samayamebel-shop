"use client"

import { useState } from "react"

const normalizedInitialImages = (initialImages: string | string[]) => {
	return typeof initialImages === "string"
		? [initialImages]
		: initialImages
}

export const useImageManager = (initialImages: string | string[] = []) => {
	const [images, setImages] = useState<FileList>()
	const [previewUrls, setPreviewUrls] = useState(normalizedInitialImages(initialImages))

	const revokeImages = () => {
		previewUrls.forEach((url) => {
			if (url.startsWith("blob:")) {
				URL.revokeObjectURL(url)
			}
		})

		setImages(undefined)
		setPreviewUrls(normalizedInitialImages(initialImages))
	}

	const changeImages = (files: FileList | null) => {
		if (
			files &&
			files.length > 0
		) {
			revokeImages()

			const nextPreviewUrls = []

			for (const file of files) {
				nextPreviewUrls.push(URL.createObjectURL(file))
			}

			setImages(files)
			setPreviewUrls(nextPreviewUrls)
		}
	}

	return {
		images,
		previewUrls,
		changeImages,
		revokeImages,
	}
}