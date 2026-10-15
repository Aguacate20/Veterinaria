"use client";

import { APPEARANCE_GROUPS, type Appearance, type AppearanceKey } from "@/lib/appearance";

type Props = {
  species: "perro" | "gato";
  value: Appearance;
  onChange: (next: Appearance) => void;
};

export default function AppearancePicker({ species, value, onChange }: Props) {
  const set = (key: AppearanceKey, opt: string) =>
    onChange({ ...value, [key]: value[key] === opt ? undefined : opt });

  return (
    <div className="space-y-5">
      {APPEARANCE_GROUPS.map((g) => (
        <div key={g.key}>
          <p className="mb-2 text-sm font-medium text-ink/70">{g.label}</p>
          <div className="grid grid-cols-3 gap-2">
            {g.options.map((o) => {
              const active = value[g.key] === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set(g.key, o.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition ${
                    active
                      ? "border-brand-500 bg-brand-50 shadow-sm ring-2 ring-brand-200"
                      : "border-sand-200 bg-white hover:border-brand-300 hover:bg-brand-50/50"
                  }`}
                >
                  <Illustration group={g.key} option={o.id} species={species} active={active} />
                  <span className={`text-xs font-semibold leading-tight ${active ? "text-brand-800" : "text-ink/75"}`}>
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Ilustraciones ---------- */

const INK = "#1a5641";
const FILL = "#d6ede2";
const MUTED = "#afdbc6";

function Illustration({
  group,
  option,
  species,
  active,
}: {
  group: AppearanceKey;
  option: string;
  species: "perro" | "gato";
  active: boolean;
}) {
  const stroke = active ? INK : "#2c8764";
  const common: S = { stroke, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };

  switch (group) {
    case "orejas":
      return <Ears option={option} species={species} s={common} />;
    case "postura":
      return <Posture option={option} s={common} />;
    case "cola":
      return <Tail option={option} s={common} />;
    case "ojos":
      return <Eyes option={option} s={common} />;
    case "encias":
      return <Gums option={option} s={common} />;
  }
}

type S = { stroke: string; strokeWidth: number; strokeLinecap: "round"; strokeLinejoin: "round"; fill: string };

/** Cabeza base: círculo + hocico. Las orejas cambian. */
function Ears({ option, species, s }: { option: string; species: "perro" | "gato"; s: S }) {
  const cat = species === "gato";
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
      {/* orejas */}
      {option === "arriba" &&
        (cat ? (
          <>
            <path d="M18 26 L14 8 L30 20" {...s} fill={FILL} />
            <path d="M46 26 L50 8 L34 20" {...s} fill={FILL} />
          </>
        ) : (
          <>
            <path d="M20 26 C14 20 12 10 18 8 C24 8 28 16 30 20" {...s} fill={FILL} />
            <path d="M44 26 C50 20 52 10 46 8 C40 8 36 16 34 20" {...s} fill={FILL} />
          </>
        ))}
      {option === "normal" &&
        (cat ? (
          <>
            <path d="M18 26 L16 12 L30 20" {...s} fill={FILL} />
            <path d="M46 26 L48 12 L34 20" {...s} fill={FILL} />
          </>
        ) : (
          <>
            <path d="M20 24 C12 24 10 34 14 40 C18 44 24 38 24 32" {...s} fill={FILL} />
            <path d="M44 24 C52 24 54 34 50 40 C46 44 40 38 40 32" {...s} fill={FILL} />
          </>
        ))}
      {option === "gachas" &&
        (cat ? (
          <>
            <path d="M18 24 L6 26 L24 32" {...s} fill={MUTED} />
            <path d="M46 24 L58 26 L40 32" {...s} fill={MUTED} />
          </>
        ) : (
          <>
            <path d="M20 26 C10 30 8 44 14 50 C20 52 24 44 24 36" {...s} fill={MUTED} />
            <path d="M44 26 C54 30 56 44 50 50 C44 52 40 44 40 36" {...s} fill={MUTED} />
          </>
        ))}
      {/* cabeza */}
      <circle cx="32" cy="34" r="16" {...s} fill="white" />
      {/* ojos */}
      {option === "gachas" ? (
        <>
          <path d="M24 32 L29 34" {...s} />
          <path d="M40 32 L35 34" {...s} />
        </>
      ) : (
        <>
          <circle cx="26" cy="32" r="2" fill={s.stroke} />
          <circle cx="38" cy="32" r="2" fill={s.stroke} />
        </>
      )}
      {/* nariz y boca */}
      <path d="M30 39 L34 39 L32 42 Z" fill={s.stroke} />
      <path d="M32 42 C32 45 29 46 28 45 M32 42 C32 45 35 46 36 45" {...s} />
    </svg>
  );
}

function Posture({ option, s }: { option: string; s: S }) {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
      {option === "normal" && (
        <>
          <rect x="16" y="26" width="30" height="16" rx="8" {...s} fill={FILL} />
          <circle cx="50" cy="26" r="7" {...s} fill="white" />
          <path d="M22 42 V52 M30 42 V52 M36 42 V52 M44 42 V52" {...s} />
          <path d="M16 30 C10 28 8 22 12 18" {...s} />
        </>
      )}
      {option === "encorvado" && (
        <>
          <path d="M14 44 C16 26 28 20 40 24 C46 26 48 32 48 38 L14 44 Z" {...s} fill={FILL} />
          <circle cx="51" cy="42" r="7" {...s} fill="white" />
          <path d="M20 44 V52 M28 43 V52 M38 41 V52 M46 46 V52" {...s} />
          <path d="M14 44 C10 44 8 48 10 52" {...s} />
        </>
      )}
      {option === "echado" && (
        <>
          <ellipse cx="30" cy="44" rx="20" ry="9" {...s} fill={MUTED} />
          <circle cx="50" cy="42" r="7" {...s} fill="white" />
          <path d="M14 48 C8 48 6 46 8 42" {...s} />
          <path d="M46 42 L50 42" {...s} />
          <path d="M20 30 L24 34 M26 28 L28 33" {...s} strokeWidth={1.6} />
        </>
      )}
    </svg>
  );
}

function Tail({ option, s }: { option: string; s: S }) {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
      <rect x="20" y="30" width="28" height="14" rx="7" {...s} fill={FILL} />
      <circle cx="50" cy="30" r="6" {...s} fill="white" />
      <path d="M26 44 V52 M34 44 V52 M42 44 V52" {...s} />
      {option === "arriba" && <path d="M20 34 C14 30 12 20 18 14" {...s} />}
      {option === "normal" && <path d="M20 36 C12 36 8 40 8 46" {...s} />}
      {option === "entre_patas" && <path d="M22 40 C18 46 22 54 30 50" {...s} stroke={INK} />}
    </svg>
  );
}

function Eyes({ option, s }: { option: string; s: S }) {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
      <circle cx="32" cy="34" r="18" {...s} fill="white" />
      {option === "brillantes" && (
        <>
          <circle cx="25" cy="31" r="4" fill={s.stroke} />
          <circle cx="39" cy="31" r="4" fill={s.stroke} />
          <circle cx="26.5" cy="29.5" r="1.3" fill="white" />
          <circle cx="40.5" cy="29.5" r="1.3" fill="white" />
        </>
      )}
      {option === "apagados" && (
        <>
          <path d="M20 31 C23 28 27 28 30 31" {...s} />
          <path d="M34 31 C37 28 41 28 44 31" {...s} />
          <path d="M21 33 L29 33 M35 33 L43 33" {...s} strokeWidth={1.5} />
        </>
      )}
      {option === "secrecion" && (
        <>
          <circle cx="25" cy="31" r="3.5" fill={s.stroke} />
          <circle cx="39" cy="31" r="3.5" fill={s.stroke} />
          <path d="M24 36 C24 40 22 42 23 45" stroke="#c98a2b" strokeWidth={2.2} strokeLinecap="round" fill="none" />
          <path d="M40 36 C40 40 42 42 41 45" stroke="#c98a2b" strokeWidth={2.2} strokeLinecap="round" fill="none" />
        </>
      )}
      <path d="M30 40 L34 40 L32 43 Z" fill={s.stroke} />
    </svg>
  );
}

function Gums({ option, s }: { option: string; s: S }) {
  const color = option === "rosadas" ? "#f28ca0" : option === "palidas" ? "#f3e4e6" : option === "azuladas" ? "#9bb6d6" : "#ddd";
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
      <path d="M14 30 C18 20 46 20 50 30 L50 36 C46 48 18 48 14 36 Z" {...s} fill={color} />
      <path d="M20 30 L44 30" {...s} />
      <path d="M22 30 L23 38 M30 30 L30 40 M34 30 L34 40 M42 30 L41 38" stroke="white" strokeWidth={3} strokeLinecap="round" />
      <path d="M22 30 L23 38 M30 30 L30 40 M34 30 L34 40 M42 30 L41 38" {...s} strokeWidth={1.2} />
    </svg>
  );
}
