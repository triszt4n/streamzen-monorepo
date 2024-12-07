import { AboutPage } from "@/pages/about.page"
import { CoursesPage } from "@/pages/courses.page"
import { EventsPage } from "@/pages/events.page"
import { IndexPage } from "@/pages/index.page"
import { LivePage } from "@/pages/live/live.page"
import { LoginPage } from "@/pages/login.page"
import { MembersPage } from "@/pages/members.page"
import { EditVideoPage } from "@/pages/studio/edit.page"
import { StudioPage } from "@/pages/studio/studio.page"
import { VideosPage } from "@/pages/videos.page"
import { VideoPage } from "@/pages/videos/video.page"
import { RouteObject } from "react-router-dom"

export type StreamzenRouteObject = RouteObject & {
  navGroup?: "main" | "studio" // on which subsite the route should be displayed in navbar
  navTitle?: string
}

export const routes: StreamzenRouteObject[] = [
  {
    path: "/",
    element: <IndexPage />,
  },
  // Main routes
  {
    path: "/videos",
    element: <VideosPage />,
    navGroup: "main",
    navTitle: "Videók",
  },
  {
    path: "/videos/:id",
    element: <VideoPage />,
    navTitle: "Videó megtekintése",
  },
  {
    path: "/live",
    element: <LivePage />,
    navTitle: "Élő megtekintése",
  },
  {
    path: "/events",
    element: <EventsPage />,
    navGroup: "main",
    navTitle: "Események",
  },
  {
    path: "/members",
    element: <MembersPage />,
    navGroup: "main",
    navTitle: "Tagok",
  },
  {
    path: "/courses",
    element: <CoursesPage />,
    navGroup: "main",
    navTitle: "Tanfolyamok",
  },
  {
    path: "/about",
    element: <AboutPage />,
    navGroup: "main",
    navTitle: "Rólunk",
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  // Studio routes
  {
    path: "/studio",
    element: <StudioPage />,
    navGroup: "studio",
    navTitle: "Stúdió kezdőlap",
  },
  {
    path: "/studio/edit/:id",
    element: <EditVideoPage />,
    navTitle: "Videó szerkesztése",
  },
]
