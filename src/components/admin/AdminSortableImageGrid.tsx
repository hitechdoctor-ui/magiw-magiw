"use client";

import { useState } from "react";

export type SortableImageRow = {
  id: string;
  previewUrl: string;
  caption?: string;
};

type AdminSortableImageGridProps = {
  items: SortableImageRow[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
  coverHint?: string;
};

export function AdminSortableImageGrid({
  items,
  onReorder,
  onRemove,
  coverHint = "Η #1 είναι η κύρια εικόνα στο Shop.",
}: AdminSortableImageGridProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((item) => item.id === dragId);
    const to = items.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0) return;
    onReorder(from, to);
    setDragId(null);
    setOverId(null);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">{coverHint}</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, index) => {
          const isDragging = dragId === item.id;
          const isOver = overId === item.id && dragId !== item.id;
          return (
            <li
              key={item.id}
              draggable
              onDragStart={() => setDragId(item.id)}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setOverId(item.id);
              }}
              onDragLeave={() => {
                if (overId === item.id) setOverId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(item.id);
              }}
              className={`cursor-grab overflow-hidden rounded-sm border bg-neutral-50 active:cursor-grabbing ${
                isOver
                  ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2"
                  : "border-stone-200"
              } ${isDragging ? "opacity-40" : ""}`}
            >
              <div className="relative aspect-[4/5] w-full bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={`Φωτο ${index + 1}`}
                  className="pointer-events-none h-full w-full object-cover object-center"
                  draggable={false}
                />
                {index === 0 && (
                  <span className="absolute left-1 top-1 bg-neutral-950 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-white">
                    Εξώφυλλο
                  </span>
                )}
              </div>
              <div className="space-y-1 p-2">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                  #{index + 1} · σύρε για σειρά
                </p>
                {item.caption ? (
                  <p className="truncate text-xs text-neutral-800">{item.caption}</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-[10px] uppercase tracking-[0.18em] text-red-700 hover:text-red-900"
                >
                  Διαγραφή
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function reorderByIndex<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}
