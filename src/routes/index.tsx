import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Package,
  LifeBuoy,
  FileText,
  HardHat,
  Activity,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-md bg-[#0a2a6c] text-white grid place-items-center font-bold text-sm">
        YZ
      </div>
      <span className={`font-semibold ${light ? "text-white" : "text-[#0a2a6c]"}`}>
        Metalúrgica YZ
      </span>
    </Link>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-white text-[#0a2a6c]">
      {/* Top nav */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Logo light />
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/90">
            <a href="#solucoes" className="hover:text-white">Soluções</a>
            <Link to="/sobre" className="hover:text-white">Sobre</Link>
            <a href="#contato" className="hover:text-white">Contato</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/90 hover:text-white">Entrar</Link>
            <Link
              to="/cadastro"
              className="rounded-md bg-[#0a2a6c] hover:bg-[#0a2a6c]/90 text-white px-4 py-2 text-sm font-medium border border-white/10"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative text-white"
        style={{
          background:
            "linear-gradient(135deg, #061a4a 0%, #0a2a6c 45%, #1454b8 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><path d=%22M0 39h40M39 0v40%22 stroke=%22white%22 stroke-opacity=%220.15%22/></svg>')]" />
        <div className="relative max-w-7xl mx-auto px-8 pt-40 pb-32">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Portal Metalúrgica YZ — versão 2026
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-[1.05] max-w-3xl">
            Eficiência industrial,
            <br />
            <span className="text-sky-400">conectada</span> em um só portal.
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/75 leading-relaxed">
            Pedidos, chamados técnicos, status de máquinas, retirada de EPI,
            documentos e canal de denúncias. Tudo o que o time da fábrica e o
            cliente precisam, em uma única plataforma.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md bg-sky-500 hover:bg-sky-400 px-5 py-3 text-sm font-medium"
            >
              Acessar agora <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#solucoes"
              className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 px-5 py-3 text-sm font-medium"
            >
              Ver soluções
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl">
            <div>
              <div className="text-3xl font-bold text-sky-400">18</div>
              <div className="text-[11px] tracking-widest text-white/60 mt-1 uppercase">
                Colaboradores
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-400">120+</div>
              <div className="text-[11px] tracking-widest text-white/60 mt-1 uppercase">
                Clientes atendidos
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-400">99,7%</div>
              <div className="text-[11px] tracking-widest text-white/60 mt-1 uppercase">
                Uptime do portal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="solucoes" className="bg-canvas py-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-xs font-semibold tracking-widest text-sky-600 uppercase">
            O que você encontra
          </p>
          <h2 className="mt-3 text-4xl font-bold max-w-2xl">
            Seis módulos integrados para a operação industrial
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Package,
                title: "Pedidos e rastreamento",
                desc: "Acompanhe seus pedidos do disparo à entrega, com previsões em tempo real.",
              },
              {
                icon: LifeBuoy,
                title: "Suporte técnico",
                desc: "Abra chamados, anexe a máquina envolvida e acompanhe o atendimento.",
              },
              {
                icon: FileText,
                title: "Documentos",
                desc: "Manuais, datasheets, normas e certificados sempre à mão.",
              },
              {
                icon: HardHat,
                title: "Retirada de EPI",
                desc: "Solicite equipamentos de proteção e acompanhe a aprovação do gestor.",
              },
              {
                icon: Activity,
                title: "Status de máquinas",
                desc: "Visão em tempo real das máquinas do seu setor — operação, alerta e manutenção.",
              },
              {
                icon: ShieldAlert,
                title: "Canal de denúncias",
                desc: "Reporte ocorrências de forma sigilosa ou anônima, 24h por dia.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border bg-card p-6 hover:border-sky-400/60 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-sky-50 text-[#0a2a6c] grid place-items-center mb-5">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="text-white"
        style={{ background: "linear-gradient(135deg, #061a4a, #0a2a6c)" }}
      >
        <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Pronto para conectar
              <br />
              sua operação?
            </h2>
            <p className="mt-3 text-white/70">
              Crie sua conta gratuitamente e ative o portal em minutos.
            </p>
          </div>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 rounded-md bg-sky-500 hover:bg-sky-400 px-6 py-3 text-sm font-medium self-start md:self-auto"
          >
            Começar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-canvas border-t">
        <div className="max-w-7xl mx-auto px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Logo />
            <p className="text-sm text-muted-foreground mt-4 max-w-xs">
              Portal integrado para clientes e colaboradores industriais.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-3">Plataforma</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#solucoes" className="hover:text-foreground">Soluções</a></li>
              <li><Link to="/login" className="hover:text-foreground">Portal</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Empresa</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sobre" className="hover:text-foreground">Sobre</Link></li>
              <li><a href="#contato" className="hover:text-foreground">Contato</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Atendimento</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>0800 701 0701</li>
              <li>atendimento@metalurgicayz.com.br</li>
              <li>Joinville, SC</li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="max-w-7xl mx-auto px-8 py-5 text-xs text-muted-foreground">
            © 2026 Metalúrgica YZ
          </div>
        </div>
      </footer>
    </div>
  );
}
