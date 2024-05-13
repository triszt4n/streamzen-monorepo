import { Link } from '@nextui-org/react'
import Container from './Container'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="flex flex-col gap-10 pt-32">
      <Container>
        <div className="flex justify-between items-center gap-3 flex-col-reverse sm:flex-row pb-10">
          <div className="h-24 sm:h-16 flex flex-col gap-3 sm:flex-row items-center text-sm">
            <Logo className="h-20 w-auto" />
            <div className="hidden sm:block leading-5">
              <p className="font-semibold">
                Image:zen - photo sharing service.
              </p>
              <p>Trisztan Piller &copy; {new Date().getFullYear()}</p>
              <p>
                <Link
                  className="text-sm"
                  href="mailto:streamzen@simonyi.bme.hu"
                >
                  Reach me here.
                </Link>
              </p>
            </div>
            <div className="block sm:hidden text-center">
              <p>Trisztan Piller &copy; {new Date().getFullYear()}</p>
              <p>
                <Link
                  className="text-sm"
                  href="mailto:streamzen@simonyi.bme.hu"
                >
                  Reach me here.
                </Link>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="pb-2 font-bold">Site map</div>
            <div className="flex flex-col items-end gap-0">
              <Link className="text-xs" href="/">
                Home page
              </Link>
              <Link className="text-xs" href="/albums">
                Your albums page
              </Link>
              <Link className="text-xs" href="/albums/new">
                New album page
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
