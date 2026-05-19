import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useState } from "react";
import { GraduationCap, CheckCircle2, XCircle, ArrowLeft, Clock } from "lucide-react";

export const Route = createFileRoute("/treinamentos")({ component: TreinamentosPage });

type Question = { q: string; opcoes: string[]; correta: number };
type Curso = {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  modulo: string;
  conteudo: string[];
  quiz: Question[];
};

const CURSOS: Curso[] = [
  {
    id: "integracao",
    titulo: "Integração — Bem-vindo à Metalúrgica YZ",
    descricao: "Conheça nossa história, valores e regras de convivência.",
    duracao: "25 min",
    modulo: "Institucional",
    conteudo: [
      "A Metalúrgica YZ foi fundada em 2007 em Caxias do Sul (RS) por dois irmãos torneiros mecânicos.",
      "Hoje somos 42 colaboradores, com foco em usinagem de precisão e estruturas soldadas para o setor agrícola.",
      "Nossos valores: segurança em primeiro lugar, qualidade no que entregamos e respeito ao colega de chão de fábrica.",
      "Horário padrão: turno 1 das 07h às 16h48 com 1h de almoço. Tolerância de 5 minutos.",
    ],
    quiz: [
      { q: "Em que cidade e ano a Metalúrgica YZ foi fundada?", opcoes: ["Bento Gonçalves, 2010", "Caxias do Sul, 2007", "Porto Alegre, 2001"], correta: 1 },
      { q: "Quantos colaboradores a empresa tem hoje?", opcoes: ["12", "42", "180"], correta: 1 },
      { q: "Qual o foco produtivo principal?", opcoes: ["Estamparia automotiva", "Usinagem de precisão e estruturas soldadas", "Fundição de alumínio"], correta: 1 },
    ],
  },
  {
    id: "nr12",
    titulo: "NR-12 — Segurança em Máquinas e Equipamentos",
    descricao: "Boas práticas e dispositivos de proteção em tornos, fresadoras e prensas.",
    duracao: "40 min",
    modulo: "Segurança do Trabalho",
    conteudo: [
      "Toda máquina deve ter dispositivo de parada de emergência acessível e visível.",
      "É proibido remover proteções fixas para acelerar a operação — comunique manutenção.",
      "Limpeza e troca de ferramenta só com a máquina parada e bloqueada (Lockout/Tagout).",
      "Roupas largas, anéis e correntes são proibidos próximos a partes móveis.",
    ],
    quiz: [
      { q: "Quando posso remover a proteção fixa de uma máquina?", opcoes: ["Para ganhar tempo na produção", "Apenas pela manutenção, com a máquina bloqueada", "Sempre que o supervisor não estiver olhando"], correta: 1 },
      { q: "Qual prática NÃO é permitida na operação?", opcoes: ["Usar EPI", "Usar anéis e correntes", "Comunicar falhas"], correta: 1 },
      { q: "O que é Lockout/Tagout?", opcoes: ["Procedimento de bloqueio e sinalização da máquina", "Tipo de ferramenta de corte", "Software de PCP"], correta: 0 },
    ],
  },
  {
    id: "epi",
    titulo: "Uso correto de EPI",
    descricao: "Quando, como e por que usar cada equipamento de proteção individual.",
    duracao: "20 min",
    modulo: "Segurança do Trabalho",
    conteudo: [
      "Óculos de proteção: obrigatório em toda a área de produção.",
      "Protetor auricular: obrigatório nos setores de Usinagem e Soldagem.",
      "Botina com bico de aço: obrigatória em toda a fábrica e pátio.",
      "Máscara de solda: uso obrigatório em qualquer atividade de soldagem, mesmo de curta duração.",
    ],
    quiz: [
      { q: "Onde o protetor auricular é obrigatório?", opcoes: ["Apenas no almoxarifado", "Em Usinagem e Soldagem", "Somente no escritório"], correta: 1 },
      { q: "A botina com bico de aço deve ser usada:", opcoes: ["Só quando carregar peso", "Em toda a fábrica e pátio", "Apenas na expedição"], correta: 1 },
    ],
  },
  {
    id: "qualidade",
    titulo: "Qualidade e ISO 9001 na prática",
    descricao: "Como nossas rotinas garantem a certificação ISO 9001:2015.",
    duracao: "30 min",
    modulo: "Qualidade",
    conteudo: [
      "Toda peça produzida passa por inspeção dimensional por amostragem.",
      "Não conformidade detectada deve ser registrada no sistema antes do final do turno.",
      "Rastreabilidade: cada lote tem um número que identifica matéria-prima, operador e máquina.",
      "Auditorias internas acontecem a cada 6 meses.",
    ],
    quiz: [
      { q: "O que devo fazer ao detectar uma peça fora de especificação?", opcoes: ["Descartar sem registrar", "Registrar a não conformidade no sistema", "Enviar mesmo assim ao cliente"], correta: 1 },
      { q: "Com que frequência ocorrem auditorias internas?", opcoes: ["Toda semana", "A cada 6 meses", "Nunca"], correta: 1 },
    ],
  },
];

function TreinamentosPage() {
  const [aberto, setAberto] = useState<Curso | null>(null);

  if (aberto) return <CursoView curso={aberto} onVoltar={() => setAberto(null)} />;

  return (
    <AppShell>
      <PageHeader
        title="Treinamentos"
        subtitle="Cursos sobre a Metalúrgica YZ e as boas práticas do nosso chão de fábrica."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURSOS.map((c) => (
          <button
            key={c.id}
            onClick={() => setAberto(c)}
            className="text-left rounded-xl border bg-card p-5 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{c.modulo}</div>
                <div className="font-semibold">{c.titulo}</div>
                <p className="text-sm text-muted-foreground mt-1">{c.descricao}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duracao}</span>
                  <span>• {c.quiz.length} perguntas</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </AppShell>
  );
}

function CursoView({ curso, onVoltar }: { curso: Curso; onVoltar: () => void }) {
  const [fase, setFase] = useState<"conteudo" | "quiz" | "fim">("conteudo");
  const [respostas, setRespostas] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);

  const responder = (i: number) => {
    const novas = [...respostas, i];
    setRespostas(novas);
    if (idx + 1 < curso.quiz.length) setIdx(idx + 1);
    else setFase("fim");
  };

  const acertos = respostas.filter((r, i) => r === curso.quiz[i]?.correta).length;

  return (
    <AppShell>
      <button onClick={onVoltar} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar para treinamentos
      </button>
      <PageHeader title={curso.titulo} subtitle={`${curso.modulo} • ${curso.duracao}`} />

      {fase === "conteudo" && (
        <div className="rounded-xl border bg-card p-6 max-w-3xl">
          <h2 className="font-semibold mb-4">Conteúdo do curso</h2>
          <ul className="space-y-3">
            {curso.conteudo.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-semibold shrink-0">{i + 1}</span>
                <p>{c}</p>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setFase("quiz")}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Iniciar quiz ({curso.quiz.length} perguntas)
          </button>
        </div>
      )}

      {fase === "quiz" && (
        <div className="rounded-xl border bg-card p-6 max-w-2xl">
          <div className="text-xs text-muted-foreground mb-2">Pergunta {idx + 1} de {curso.quiz.length}</div>
          <h2 className="font-semibold text-lg mb-5">{curso.quiz[idx].q}</h2>
          <div className="space-y-2">
            {curso.quiz[idx].opcoes.map((o, i) => (
              <button
                key={i}
                onClick={() => responder(i)}
                className="w-full text-left rounded-md border px-4 py-3 text-sm hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {fase === "fim" && (
        <div className="rounded-xl border bg-card p-6 max-w-2xl">
          <h2 className="font-semibold text-lg mb-1">Resultado</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Você acertou <strong>{acertos}</strong> de <strong>{curso.quiz.length}</strong> perguntas.
          </p>
          <div className="space-y-3">
            {curso.quiz.map((q, i) => {
              const ok = respostas[i] === q.correta;
              return (
                <div key={i} className="rounded-md border p-3 flex gap-3">
                  {ok ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                  )}
                  <div className="text-sm">
                    <div className="font-medium">{q.q}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Sua resposta: {q.opcoes[respostas[i]]} {!ok && <> • Correta: {q.opcoes[q.correta]}</>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => { setRespostas([]); setIdx(0); setFase("quiz"); }}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
            >
              Refazer quiz
            </button>
            <button
              onClick={onVoltar}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
