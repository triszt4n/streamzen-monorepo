import schLogo from "@/assets/logo-sch-easy.svg"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth.hook"
import { MainLayout } from "@/layouts/main.layout"

export const LoginPage = () => {
  const { login } = useAuth()

  return (
    <MainLayout currentHref="/login" className="max-w-7xl mx-auto my-16" publicPage>
      <h1 className="text-2xl font-medium tracking-tight lg:text-3xl text-center mb-8">A folytatáshoz bejelentkezés szükséges</h1>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            login()
          }}
          variant="outline"
        >
          <div className="flex justify-between items-center">
            <img src={schLogo} className="w-4 h-4 mr-2" alt="AuthSCH" />
            <div>AuthSCH bejelentkezés</div>
          </div>
        </Button>
      </div>
    </MainLayout>
  )
}
