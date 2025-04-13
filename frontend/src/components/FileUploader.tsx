/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { X } from "lucide-react";

interface ImageFile {
  file: File;
  preview: string;
}

type Props = {
  handleImageChange: (image: File) => void;
};
export default function ImageUploader({ handleImageChange }: Props) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList): void => {
    const imageFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages: ImageFile[] = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    handleImageChange(newImages[0].file);
  };

  const removeImage = (index: number): void => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={false}
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <p className="mb-2 text-sm text-gray-500">
          Drag and drop images here or click to browse
        </p>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.preview}
                alt={`Preview ${index}`}
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
