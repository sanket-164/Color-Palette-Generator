/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  onSubmit: (files: File[], compress: boolean) => void;
};

export default function ImageUploader({ onSubmit }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [compress, setCompress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const imageFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(files, compress);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <Card
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragging
            ? "border-primary bg-muted/50"
            : "border-muted-foreground/25"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Drag & drop images</h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to upload
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
          <Button variant="outline">Choose Images</Button>
        </CardContent>
      </Card>
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="max-h-[250px] overflow-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="compress"
              checked={compress}
              onCheckedChange={setCompress}
            />
            <Label htmlFor="compress">Compress images</Label>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
