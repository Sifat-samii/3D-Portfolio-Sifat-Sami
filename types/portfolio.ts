export type RoomId =
  | "living"
  | "music"
  | "web"
  | "creative"
  | "events"
  | "academics"
  | "professional";

export type DoorId = `${RoomId}-to-${RoomId}`;

export type ObjectId =
  | "welcome-frame"
  | "contact-laptop"
  | "resume-frame"
  | "guitar"
  | "poster-wall"
  | "speaker"
  | "main-monitor"
  | "whiteboard"
  | "dashboard-screen"
  | "server-rack"
  | "jewelry-table"
  | "painting-wall"
  | "sketchbook"
  | "planning-board"
  | "campaign-wall"
  | "ticket-counter"
  | "business-desk"
  | "certificate-wall"
  | "research-frame"
  | "bookshelf"
  | "timeline-wall"
  | "kpi-dashboard"
  | "project-board"
  | "workflow-diagram";

export type OverlayId =
  | "welcome"
  | "contact"
  | "resume"
  | "musicProfile"
  | "bandProjects"
  | "audioPreview"
  | "webProjects"
  | "techStack"
  | "productCaseStudies"
  | "automationSystems"
  | "beadsBonita"
  | "artworkGallery"
  | "creativeDirection"
  | "eventCaseStudies"
  | "campaignHighlights"
  | "eventPortfolio"
  | "entrepreneurship"
  | "certifications"
  | "researchPublication"
  | "academicBackground"
  | "careerTimeline"
  | "professionalImpact"
  | "professionalCaseStudies"
  | "workflowSystems";

export type Vector3Tuple = [number, number, number];

export type LightingPresetId =
  | "livingWarm"
  | "musicStage"
  | "webDigital"
  | "creativeWarm"
  | "eventsGold"
  | "academicsLibrary"
  | "professionalNavy";

export type LightingPreset = {
  id: string;
  color: string;
  accent: string;
  ambient: number;
  activeIntensity: number;
  inactiveIntensity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
};

export type DoorConfig = {
  id: DoorId;
  label: string;
  fromRoom: RoomId;
  toRoom: RoomId;
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
  targetPosition: Vector3Tuple;
  accentColor?: string;
};

export type InteractiveObjectConfig = {
  id: ObjectId;
  label: string;
  roomId: RoomId;
  overlayId: OverlayId;
  position: Vector3Tuple;
  shape?: "box" | "sphere" | "cylinder" | "plane";
  accentColor?: string;
};

export type RoomConfig = {
  id: RoomId;
  label: string;
  tagline: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  themeColor: string;
  wallColor: string;
  trimColor: string;
  accentColor: string;
  lightingPreset: LightingPresetId;
  entryPoint: Vector3Tuple;
  cameraOffset?: Vector3Tuple;
  doors: DoorConfig[];
  objects: InteractiveObjectConfig[];
};

export type ProjectItem = {
  title: string;
  description: string;
  tech: string[];
  type: string;
  status: string;
  link?: string;
  highlights: string[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  achievements: string[];
  impactMetrics: string[];
};

export type SkillItem = {
  label: string;
  category: string;
};

export type ContactInfo = {
  email: string;
  linkedin: string;
  github: string;
  website: string;
  callToAction: string;
};
