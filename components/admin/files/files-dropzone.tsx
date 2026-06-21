"use client";

import { useRef } from "react";

import { Upload } from "lucide-react";

type FilesDropzoneProps = {
  uploading: boolean;
  progress: string;
  onUpload: (files: FileList) => Promise<void>;
};

export function FilesDropzone({
  uploading,
  progress,
  onUpload,
}: FilesDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      onUpload(e.dataTransfer.files);
    }
  }

  return (
    <>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="
                    cursor-pointer
                    rounded-2xl
                    border-2
                    border-dashed
                    border-zinc-300
                    bg-white
                    p-10
                    text-center
                    transition-colors
                    hover:bg-zinc-50
                "
      >
        <Upload className="mx-auto mb-2" />

        <div>Перетащите файлы сюда или нажмите</div>

        {uploading && (
          <div className="mt-2 text-sm text-zinc-500">{progress}</div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) {
            onUpload(e.target.files);
          }
        }}
      />
    </>
  );
}
