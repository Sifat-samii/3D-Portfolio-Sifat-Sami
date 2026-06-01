"use client";

import type { OverlayId } from "@/types/portfolio";
import { events } from "@/data/events";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

const titles: Partial<Record<OverlayId, string>> = {
  eventCaseStudies: "Event Case Studies",
  campaignHighlights: "Campaign Highlights",
  eventPortfolio: "Event Portfolio",
  entrepreneurship: "Entrepreneurship",
};

export function EventsOverlay({ overlayId, onClose }: { overlayId: OverlayId; onClose: () => void }) {
  return (
    <BaseOverlay
      title={titles[overlayId] ?? "Events, Management & Business"}
      subtitle="Event planning, campaigns, brand activations, leadership, and business coordination."
      onClose={onClose}
    >
      {overlayId === "eventCaseStudies" ? (
        <div className="flex flex-wrap gap-2">
          {events.eventProjects.length === 0 ? (
            <EmptyState />
          ) : (
            events.eventProjects.map((item, index) => (
              <Badge key={`${overlayId}-event-${index}`}>{item}</Badge>
            ))
          )}
        </div>
      ) : null}

      {overlayId === "campaignHighlights" ? (
        <div className="flex flex-wrap gap-2">
          {events.campaignWork.length === 0 ? (
            <EmptyState />
          ) : (
            events.campaignWork.map((item, index) => (
              <Badge key={`${overlayId}-campaign-${index}`}>{item}</Badge>
            ))
          )}
        </div>
      ) : null}

      {overlayId === "eventPortfolio" ? (
        <div className="grid gap-4 md:grid-cols-3">
          {events.highlights.length === 0 ? (
            <EmptyState />
          ) : (
            events.highlights.map((highlight, index) => (
              <Card key={`${overlayId}-highlight-${index}`}>
                <p className="text-sm leading-6 text-slate-300">{highlight}</p>
              </Card>
            ))
          )}
        </div>
      ) : null}

      {overlayId === "entrepreneurship" ? (
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {events.businessExperience.length === 0 ? (
              <EmptyState />
            ) : (
              events.businessExperience.map((item, index) => (
                <Badge key={`${overlayId}-business-${index}`}>{item}</Badge>
              ))
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {events.roles.map((item, index) => (
              <Badge key={`${overlayId}-role-${index}`}>{item}</Badge>
            ))}
          </div>
        </div>
      ) : null}
    </BaseOverlay>
  );
}
