"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onSave?: (file: File) => Promise<string | void> | string | void;
  onRemove?: () => Promise<void> | void;
  initialImageUrl?: string;
  displaySize?: number;
};

export default function AvatarUploader({
  onSave,
  onRemove,
  initialImageUrl,
  displaySize = 160,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl ?? null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 200 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [saving, setSaving] = useState(false);

  const MIN_SIZE = 150;

  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    cropX: 0,
    cropY: 0,
    cropSize: 0,
  });

  useEffect(() => {
    setPreviewUrl(initialImageUrl ?? null);
  }, [initialImageUrl]);

  useEffect(
    () => () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    },
    [],
  );

  const updatePreview = (nextUrl: string | null, nextIsObjectUrl = false) => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    if (nextIsObjectUrl && nextUrl) {
      previewObjectUrlRef.current = nextUrl;
    }

    setPreviewUrl(nextUrl);
  };

  const handleFileChange = (file?: File) => {
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a JPG, PNG, or WebP image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (img: HTMLImageElement) => {
    setImgEl(img);
    const shortestSide = Math.min(img.naturalWidth, img.naturalHeight);
    const initialSize = Math.max(shortestSide * 0.7, MIN_SIZE);

    setCrop({
      x: (img.naturalWidth - initialSize) / 2,
      y: (img.naturalHeight - initialSize) / 2,
      size: initialSize,
    });
  };

  const displayData = useMemo(() => {
    if (!imgEl) {
      return null;
    }

    const maxWidth = 500;
    const scale = Math.min(1, maxWidth / imgEl.naturalWidth);
    const width = imgEl.naturalWidth * scale;
    const height = imgEl.naturalHeight * scale;

    return {
      width,
      height,
      scaleX: width / imgEl.naturalWidth,
      scaleY: height / imgEl.naturalHeight,
    };
  }, [imgEl]);

  const clampCrop = (next: { x: number; y: number; size: number }) => {
    if (!imgEl) {
      return next;
    }

    const size = Math.max(
      MIN_SIZE,
      Math.min(next.size, imgEl.naturalWidth, imgEl.naturalHeight),
    );
    const x = Math.max(0, Math.min(next.x, imgEl.naturalWidth - size));
    const y = Math.max(0, Math.min(next.y, imgEl.naturalHeight - size));

    return { x, y, size };
  };

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
      cropSize: crop.size,
    };
  };

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
      cropSize: crop.size,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgEl || !displayData) {
      return;
    }

    const dx = (e.clientX - dragStartRef.current.mouseX) / displayData.scaleX;
    const dy = (e.clientY - dragStartRef.current.mouseY) / displayData.scaleY;

    if (dragging) {
      setCrop(
        clampCrop({
          x: dragStartRef.current.cropX + dx,
          y: dragStartRef.current.cropY + dy,
          size: dragStartRef.current.cropSize,
        }),
      );
    }

    if (resizing) {
      const delta = Math.max(dx, dy);
      setCrop(
        clampCrop({
          x: dragStartRef.current.cropX,
          y: dragStartRef.current.cropY,
          size: dragStartRef.current.cropSize + delta,
        }),
      );
    }
  };

  const stopInteractions = () => {
    setDragging(false);
    setResizing(false);
  };

  const generateAvatarFile = async (): Promise<File | null> => {
    if (!imgEl) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgEl, crop.x, crop.y, crop.size, crop.size, 0, 0, 512, 512);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9,
      );
    });
  };

  const handlePreview = async () => {
    const file = await generateAvatarFile();

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    updatePreview(objectUrl, true);
    setImageSrc(null);
    setImgEl(null);
  };

  const handleSave = async () => {
    const file = await generateAvatarFile();

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    updatePreview(objectUrl, true);

    if (onSave) {
      try {
        setSaving(true);
        const savedUrl = await onSave(file);

        if (savedUrl) {
          updatePreview(savedUrl);
        }
      } finally {
        setSaving(false);
      }
    }

    setImageSrc(null);
    setImgEl(null);
  };

  return (
    <div className="w-full max-w-3xl rounded-[2rem] border border-white/12 bg-[#130f23]/90 p-6 text-white shadow-[0_30px_80px_rgba(5,4,12,0.34)] backdrop-blur-xl">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold">Profile Photo</h2>
        <p className="mt-1 text-sm text-white/65">
          Upload a square-friendly image. Best results: centered subject, at least
          300 x 300.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div
          className="overflow-hidden rounded-full border border-white/12 bg-white/8"
          style={{ width: displaySize, height: displaySize }}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar preview" className="avatar h-full w-full" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/55">
              No photo
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#08070f]"
          >
            Choose Image
          </button>

          <button
            type="button"
            onClick={async () => {
              setImageSrc(null);
              setImgEl(null);
              updatePreview(null);
              if (onRemove) {
                await onRemove();
              }
            }}
            className="rounded-full border border-white/14 px-4 py-2 text-sm font-semibold text-white"
          >
            Remove
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
      </div>

      {imageSrc ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/72">
            Crop your image
          </p>

          <div
            className="relative inline-block select-none overflow-hidden rounded-[1.5rem]"
            onMouseMove={handleMouseMove}
            onMouseUp={stopInteractions}
            onMouseLeave={stopInteractions}
          >
            <img
              src={imageSrc}
              alt="Upload to crop"
              className="block max-w-full rounded-[1.5rem]"
              style={{
                width: displayData?.width ?? "auto",
                height: displayData?.height ?? "auto",
              }}
              onLoad={(e) => onImageLoad(e.currentTarget)}
            />

            {imgEl && displayData ? (
              <div
                onMouseDown={startDrag}
                className="absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                style={{
                  left: crop.x * displayData.scaleX,
                  top: crop.y * displayData.scaleY,
                  width: crop.size * displayData.scaleX,
                  height: crop.size * displayData.scaleY,
                }}
              >
                <div
                  onMouseDown={startResize}
                  className="absolute bottom-0 right-0 h-4 w-4 translate-x-1/2 translate-y-1/2 cursor-se-resize rounded-full border-2 border-white bg-black"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="rounded-full border border-white/14 px-4 py-2 text-sm font-semibold text-white"
            >
              Preview
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#08070f] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Avatar"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
