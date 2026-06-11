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
import { roomById } from "@/lib/roomConfig";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionLabel } from "@/components/ui/SectionLabel";

const NAV_SECTIONS = [
  { id: "about", label: "About", roomId: "living" as const },
  { id: "music", label: "Music", roomId: "music" as const },
  { id: "web", label: "Web", roomId: "web" as const },
  { id: "creative", label: "Creative", roomId: "creative" as const },
  { id: "events", label: "Events", roomId: "events" as const },
  { id: "academics", label: "Academics", roomId: "academics" as const },
  { id: "professional", label: "Work", roomId: "professional" as const },
  { id: "contact", label: "Contact", roomId: "living" as const },
];

function Section({
  id,
  title,
  accentColor,
  children,
}: {
  id: string;
  title: string;
  accentColor: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/[0.06] px-5 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <SectionLabel accentColor={accentColor}>Section</SectionLabel>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

export function MobilePortfolio({ isWebGLFallback = false }: { isWebGLFallback?: boolean }) {
  return (
    <main id="portfolio-content" className="relative z-10 min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{profile.name}</p>
            <p className="truncate text-[11px] text-white/50">{profile.title}</p>
          </div>
          <nav aria-label="Portfolio sections" className="hidden shrink-0 gap-1 sm:flex">
            {NAV_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
        <nav
          aria-label="Portfolio sections"
          className="flex gap-2 overflow-x-auto px-5 pb-3 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {NAV_SECTIONS.map((section) => (
            <a
              key={`mobile-${section.id}`}
              href={`#${section.id}`}
              className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/70 transition hover:border-white/[0.14] hover:text-white"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      {isWebGLFallback ? (
        <div
          role="status"
          className="border-b border-amber-400/20 bg-amber-400/[0.08] px-5 py-3 text-center text-sm text-amber-100/90"
        >
          3D view is unavailable on this device. Showing the scrollable portfolio instead.
        </div>
      ) : null}

      <section className="px-5 pb-10 pt-14">
        <div className="mx-auto w-full max-w-4xl">
          <SectionLabel accentColor={roomById.living.accentColor}>Interactive portfolio</SectionLabel>
          <h1 className="mt-3 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl">{profile.name}</h1>
          <p className="mt-3 text-lg text-slate-200">{profile.title}</p>
          <p className="mt-2 text-sm text-white/50">{profile.location}</p>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300">{profile.shortBio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${contact.email}`}>Email me</ButtonLink>
            <ButtonLink href={contact.resumeUrl} variant="ghost">
              Resume
            </ButtonLink>
          </div>
        </div>
      </section>

      <Section id="about" title="About" accentColor={roomById.living.accentColor}>
        <Card>
          <SectionLabel accentColor={roomById.living.accentColor}>Current focus</SectionLabel>
          <p className="mt-3 text-sm leading-7 text-slate-300">{profile.currentFocus}</p>
        </Card>
      </Section>

      <Section id="music" title="Music & Guitar" accentColor={roomById.music.accentColor}>
        <Card>
          <p className="text-sm leading-7 text-slate-300">{music.intro}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{music.role}</Badge>
            {music.bandName ? <Badge>{music.bandName}</Badge> : null}
          </div>
        </Card>
      </Section>

      <Section id="web" title="Web & Digital Services" accentColor={roomById.web.accentColor}>
        <div className="grid gap-4">
          {webProjects.length === 0 ? (
            <EmptyState />
          ) : (
            webProjects.map((project) => (
              <Card key={project.title}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <Badge>{project.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={`${project.title}-${tech}`}>{tech}</Badge>
                  ))}
                </div>
                {project.link ? (
                  <div className="mt-4">
                    <ButtonLink href={project.link} variant="ghost" className="px-0">
                      View project →
                    </ButtonLink>
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </div>
      </Section>

      <Section id="creative" title="Creative Work" accentColor={roomById.creative.accentColor}>
        <Card>
          {creative.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {creative.categories.map((category) => (
                <Badge key={category}>{category}</Badge>
              ))}
            </div>
          ) : (
            <EmptyState message="Creative categories will appear here." />
          )}
        </Card>
      </Section>

      <Section id="events" title="Events & Business" accentColor={roomById.events.accentColor}>
        <Card>
          {events.highlights.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              {events.highlights.map((highlight, index) => (
                <li key={`event-${index}`}>{highlight}</li>
              ))}
            </ul>
          ) : (
            <EmptyState message="Event highlights will appear here." />
          )}
        </Card>
      </Section>

      <Section id="academics" title="Academics" accentColor={roomById.academics.accentColor}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <SectionLabel accentColor={roomById.academics.accentColor}>Degree</SectionLabel>
            <p className="mt-2 text-lg font-semibold">{academics.degree}</p>
            <p className="mt-1 text-sm text-slate-400">{academics.university}</p>
          </Card>
          <Card>
            <SectionLabel accentColor={roomById.academics.accentColor}>Research</SectionLabel>
            <p className="mt-2 text-sm leading-6 text-slate-300">{academics.thesis}</p>
          </Card>
        </div>
      </Section>

      <Section id="professional" title="Professional Experience" accentColor={roomById.professional.accentColor}>
        <div className="grid gap-4">
          {experience.length === 0 ? (
            <EmptyState />
          ) : (
            experience.map((item) => (
              <Card key={`${item.company}-${item.role}`}>
                <SectionLabel accentColor={roomById.professional.accentColor}>{item.duration}</SectionLabel>
                <h3 className="mt-2 text-xl font-semibold">{item.role}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.company}</p>
              </Card>
            ))
          )}
        </div>
      </Section>

      <Section id="contact" title="Contact" accentColor={roomById.living.accentColor}>
        <Card>
          <p className="text-sm leading-7 text-slate-300">{contact.callToAction}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${contact.email}`}
              className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-white/[0.14] hover:bg-white/[0.06]"
            >
              <span className="block text-[10px] uppercase tracking-[0.25em] text-cyan-300">Email</span>
              <span className="mt-1 block break-words">{contact.email}</span>
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-white/[0.14] hover:bg-white/[0.06]"
            >
              <span className="block text-[10px] uppercase tracking-[0.25em] text-cyan-300">LinkedIn</span>
              <span className="mt-1 block truncate">Connect</span>
            </a>
          </div>
        </Card>
      </Section>

      <footer className="border-t border-white/[0.06] px-5 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </main>
  );
}
