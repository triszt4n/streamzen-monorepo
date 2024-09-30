import acLogo from "@/assets/logo-ac.svg"
import kirdevLogo from "@/assets/logo-kirdev.svg"
import schfullLogo from "@/assets/logo-sch.svg"
import schdesignLogo from "@/assets/logo-schdesign.svg"
import simonyiLogo from "@/assets/logo-simonyi.svg"
import vikLogo from "@/assets/logo-vik.svg"
import fbLogo from "@/assets/socials/facebook.svg"
import instaLogo from "@/assets/socials/instagram.svg"
import youtubeLogo from "@/assets/socials/youtube.svg"
import { Button } from "./ui/button"

const socials = [
  { href: "https://instagram.com/budavari_schonherz_studio", icon: instaLogo },
  { href: "https://youtube.com/bsstudi0", icon: youtubeLogo },
  { href: "https://facebook.com/bsstudio", icon: fbLogo },
]
const sponsors = [
  { href: "https://ac-studio.hu", icon: acLogo },
  { href: "https://sch.bme.hu", icon: schfullLogo },
  { href: "https://simonyi.bme.hu", icon: simonyiLogo },
  { href: "https://schdesign.hu", icon: schdesignLogo },
  { href: "https://kir-dev.hu", icon: kirdevLogo },
  { href: "https://vik.bme.hu", icon: vikLogo },
]

export const Footer = () => {
  return (
    <footer className="bg-[#031731] text-secondary-foreground flex flex-col items-center justify-center gap-6 px-4 py-8">
      <div className="flex flex-col text-center">
        <div className="pb-2 text-3xl font-semibold tracking-tight">Kapcsolat</div>
        <Button variant="link" size="lg" className="text-lg text-tertiary">
          <a href="mailto:info@bsstudio.hu">info@bsstudio.hu</a>
        </Button>
      </div>
      <div className="flex flex-row gap-6">
        {socials.map((s) => (
          <a key={s.href} href={s.href} target="_blank" className="p-2 border-4 border-white rounded-full hover:opacity-60 transition-opacity">
            <img src={s.icon} className="h-6 w-6" />
          </a>
        ))}
      </div>
      <div className="flex flex-row gap-16">
        {sponsors.map((s) => (
          <a key={s.href} href={s.href} target="_blank" className="hover:opacity-60 transition-opacity">
            <img src={s.icon} className="h-12 max-w-40 w-full" />
          </a>
        ))}
      </div>
    </footer>
  )
}
