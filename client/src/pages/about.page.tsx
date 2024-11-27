import { AboutSection } from "@/components/composite/about-section"
import { MainLayout } from "@/layouts/main.layout"

import img1Url from "@/assets/photos/image 1.png"
import img2Url from "@/assets/photos/image 2.png"
import img3Url from "@/assets/photos/image 3.png"
import img4Url from "@/assets/photos/image 4.png"
import { GridVideos } from "@/components/composite/grid-videos"

export const AboutPage = () => {
  return (
    <MainLayout currentHref="/about" className="max-w-7xl mx-auto" publicPage>
      <h1 className="text-4xl font-medium tracking-tight lg:text-5xl font-heading">Budavári Schönherz Stúdió</h1>
      <AboutSection title="Mit csinál egy BSS-es?" imageSrc={img1Url} imageOnLeft={false}>
        <p>
          A Budavári Schönherz Stúdió, röviden BSS, 1962 óta diákok által üzemeltetett nonprofit, profi rádió-, hang- és videóstúdió. A legfontosabb célunk,
          hogy megtanítsuk Neked, amit a médiában meg lehet tanulni: a mikrofonozástól kezdve, a videóvágáson át, a komplett húszfős élő adás lebonyolításáig
          mindent.
        </p>
        <p>Nem véletlenül dolgoznak tapasztalt öregstúdiósaink a legnagyobb csatornáknál: a MTVA-nál, az RTL klubnál vagy a TV2-nél.</p>
        <p>
          Schönherz Zoltán KollégiumStúdiónk másik fontos célja, hogy tudósítson a Schönherz és a villanykar összes fontos eseményéről, megőrizze a jövőnek
          karunk közösségi életét. Online archívumunkban az elmúlt évek eseményeiről több száz videó nézhető meg. Szigorúan őrzött polcainkon 30 év videóanyaga
          és 50 év hanganyaga között lehet kutatni.
        </p>
      </AboutSection>
      <AboutSection title="Mérnök is kell, bölcsész is" imageSrc={img2Url} imageOnLeft={true}>
        <p>
          A média világa komoly mérnöki ismereteket kíván. Egyszerre több száz nézőt kell kiszolgálni az élő tévéadáson, gondoskodni kell az automatizált
          videófeldolgozásról, vagy éppen összerakni egy négy kamerás videórendszert. Profi kameráink, eszközeink használata komoly szakértelmet kíván.
        </p>
        <p>
          A tartalom előállítás terén rengeteg kreativitásra és tartalomszerkesztési ismeretre van szükség. Nálunk megtanulhatod, hogyan lehet megszerkeszteni
          egy videóanyagot, egy élő magazinműsort, vagy kiélheted művészi vénádat az operatőrködés és videóvágás területén. Ha szeretsz beszélni, lehetsz
          televíziós műsorvezető, és megtanítjuk neked azt is, hogyan tudsz jó riportot, interjút készíteni.
        </p>
      </AboutSection>
      <AboutSection title="Mivel foglalkozunk?" imageSrc={img3Url} imageOnLeft={false}>
        <p>
          Heti egy alkalommal egy órás élő televíziós magazinműsorban mutatjuk be a VIK legfontosabb eseményeit. Négykamerás greenboxos stúdiónkban az adás
          alatt több mint 15 ember munkáját hangolja össze a rendező. Hetente 4-5 szerkesztett anyagon dolgoznak vágóink. Emellett üzemeltetjük, karbantartjuk a
          stúdió informatikai-, hang- és videórendszerét is.
        </p>
        <p>
          Félévente több gyakorlatorientált tanfolyamot tartunk (ezek egy része a meglévő tagjainknak szól) a hangtechnika, videótechnika, operatőrködés,
          világítás, videószerkesztés, műsorszerkesztés és műsorvezetés témakörökben.
        </p>
        <p>
          Öntevékeny köri rendszerben oktatunk, azaz a bevezető tanfolyamok után az együttes munka alatt egymástól, és a több éve az iparban dolgozó, nagy
          tapasztalattal rendelkező stúdiósoktól tanuljuk meg a legapróbb trükköket.
        </p>
      </AboutSection>
      <AboutSection title="Amikor nem forog a kamera" imageSrc={img4Url} imageOnLeft={true}>
        <p>
          A stúdió, mint minden közösség, hagyományokkal rendelkezik. Az egyik ilyen, hogy minden évben elmegyünk egy vagy két részben szakmai kirándulásra,
          melynek során, ha lehetőség adódik rá ellátogatunk egy vidéki tévé- vagy rádióstúdióba. Rendszeresen megszervezzük a BSS öregtalálkozót, ahol a régi
          stúdiósok sok érdekes történetet mesélnek a média múltjáról és jelenéről, illetve arról, hogy milyen volt a BSS régebben.
        </p>
        <p>
          Fontos program az évente megrendezésre kerülő stúdiós- illetve stúdióvezető avatás, ami az avatandók számára nem kis próbatétellel és sok vízzel jár.
          Az "Etalon" megdöntőjének pedig minden évben egy különleges díj a jutalma.
        </p>
        <p>
          Szeretünk BANG-ezni, pókerezni, vizipipázni, túrázni. Van egy Pitypang névre keresztelt óriás plüss zsiráfunk is, aki a BSS kabalaállata, és az élő
          adások rendszeres szereplője.
        </p>
      </AboutSection>
      <div className="max-w-5xl mx-auto text-base leading-5 space-y-4 my-8">
        <h2 className="text-2xl font-extrabold tracking-tight">Hogyan csatlakozhatok?</h2>
        <p>
          Stúdiónk közösségébe úgy tudsz a legkönnyebben bekerülni, hogy eljössz valamelyik tanfolyamunkra (tipikusan operatőr vagy szerkesztő-riporter
          tanfolyam). Az alapok elsajátítása után, már foghatod is a kamerát vagy a mikrofont. Kérdezz bátran e-mailben, esetleg személyesen a Schönherz koli
          első emeletén, a 106-os szobában!
        </p>
      </div>
      <GridVideos videos={[]} />
    </MainLayout>
  )
}
