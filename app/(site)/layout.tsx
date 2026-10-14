import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ScrollProgress } from "@/components/motion";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <ScrollProgress />
      <Header />
      <main id="contenu" className="flex-1 max-[720px]:pb-20">
        {children}
      </main>
      <Footer />
      <MobileBar />
      <WhatsAppFab />
    </div>
  );
}
