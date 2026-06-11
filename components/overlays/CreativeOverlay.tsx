"use client";

import type { OverlayId } from "@/types/portfolio";
import { creative } from "@/data/creative";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

const titles: Partial<Record<OverlayId, string>> = {
  beadsBonita: "Beads Bonita",
  artworkGallery: "Artwork Gallery",
  creativeDirection: "Creative Direction",
};

export function CreativeOverlay({ overlayId, onClose }: { overlayId: OverlayId; onClose: () => void }) {
  const accent = getOverlayAccent(overlayId);

  return (
    <BaseOverlay
      title={titles[overlayId] ?? "Creative Work"}
      subtitle="Handmade products, paintings, crafts, product design, and brand visual direction."
      accentColor={accent}
      onClose={onClose}
    >
      {overlayId === "beadsBonita" ? (
        <Card>
          <h3 className="font-semibold">{creative.brandName}</h3>
          {creative.craftProjects.length === 0 ? (
            <div className="mt-4">
              <EmptyState />
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-300">{creative.craftProjects.join(", ")}</p>
          )}
        </Card>
      ) : null}

      {overlayId === "artworkGallery" ? (
        <Card>
          <h3 className="font-semibold">Artworks</h3>
          {creative.artworks.length === 0 ? (
            <div className="mt-4">
              <EmptyState />
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-300">{creative.artworks.join(", ")}</p>
          )}
        </Card>
      ) : null}

      {overlayId === "creativeDirection" ? (
        <Card>
          <h3 className="font-semibold">Direction</h3>
          {creative.creativeDirectionItems.length === 0 ? (
            <div className="mt-4">
              <EmptyState />
            </div>
          ) : (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
              {creative.creativeDirectionItems.map((item, index) => (
                <li key={`${overlayId}-${item}-${index}`}>{item}</li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {creative.categories.map((category) => (
          <Badge key={category}>{category}</Badge>
        ))}
      </div>
    </BaseOverlay>
  );
}
