"use client";

import type { ReactNode } from "react";
import { academics } from "@/data/academics";
import { contact } from "@/data/contact";
import { creative } from "@/data/creative";
import { events } from "@/data/events";
import { experience } from "@/data/experience";
import { music } from "@/data/music";
import { profile } from "@/data/profile";
import { webProjects } from "@/data/webProjects";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-10">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function MobilePortfolio() {
  return (
    <main className="min-h-screen bg-slate-950 text-white md:hidden">
      <section className="px-5 pb-12 pt-16">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Interactive portfolio</p>
        <h1 className="mt-4 text-4xl font-black leading-tight">{profile.name}</h1>
        <p className="mt-3 text-lg text-slate-200">{profile.title}</p>
        <p className="mt-5 text-sm leading-6 text-slate-300">{profile.shortBio}</p>
      </section>
      <Section title="About">
        <Card>{profile.currentFocus}</Card>
      </Section>
      <Section title="Music">
        <Card>{music.intro}</Card>
      </Section>
      <Section title="Web Projects">
        <div className="grid gap-4">
          {webProjects.length === 0 ? (
            <EmptyState />
          ) : (
            webProjects.map((project) => (
              <Card key={project.title}>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={`${project.title}-${tech}`}>{tech}</Badge>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </Section>
      <Section title="Creative Work">
        <Card>{creative.categories.length > 0 ? creative.categories.join(", ") : "No creative categories yet."}</Card>
      </Section>
      <Section title="Events & Business">
        <Card>{events.highlights.length > 0 ? events.highlights.join(" ") : "No event highlights yet."}</Card>
      </Section>
      <Section title="Academics">
        <Card>
          {academics.degree} - {academics.thesis}
        </Card>
      </Section>
      <Section title="Professional Experience">
        <div className="grid gap-4">
          {experience.length === 0 ? (
            <EmptyState />
          ) : (
            experience.map((item) => (
              <Card key={`${item.company}-${item.role}`}>
                <h3 className="text-xl font-semibold">{item.company}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.role}</p>
              </Card>
            ))
          )}
        </div>
      </Section>
      <Section title="Contact">
        <Card>
          <p>{contact.callToAction}</p>
          <a href={`mailto:${contact.email}`} className="mt-4 block text-cyan-300 underline-offset-2 hover:underline">
            {contact.email}
          </a>
        </Card>
      </Section>
    </main>
  );
}
