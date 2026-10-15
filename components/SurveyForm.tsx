"use client";

import { useRef, useState } from "react";
import { SYMPTOMS, type Survey, type TriageResult } from "@/lib/schema";
import type { Appearance } from "@/lib/appearance";
import AppearancePicker from "./AppearancePicker";
import AdSlot from "./AdSlot";
import ResultCard from "./ResultCard";

type FormState = Omit<Survey, "ageYears" | "photo" | "appearance"> & { ageYears: string; photo: string | null; appearance: Appearance };

const INITIAL: FormState = {
  species: "perro",
  name: "",
  ageYears: "",
  sex: "no_se",
  symptoms: [],
  duration: "horas",
  severity: "leve",
  eating: "normal",
  behavior: "normal",
  notes: "",
  photo: null,
  appearance: {},
};

const MAX_BASE64_BYTES = 170_000; // límite práctico de imagen inline en la API de NVIDIA (~180 KB)

async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");

  // Reduce resolución y calidad progresivamente hasta caber en el límite.
  const attempts: [number, number][] = [
    [1024, 0.8],
    [896, 0.75],
    [768, 0.7],
    [640, 0.65],
    [512, 0.6],
    [400, 0.55],
  ];
  let out = "";
  for (const [maxDim, quality] of attempts) {
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    out = canvas.toDataURL("image/jpeg", quality);
    if (out.length <= MAX_BASE64_BYTES) break;
  }
  bitmap.close();
  return out;
}

export default function SurveyForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ result: TriageResult; redFlags: string[]; degraded?: boolean } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const toggleSymptom = (id: string) =>
    setForm((f) => ({
      ...f,
      symptoms: f.symptoms.includes(id) ? f.symptoms.filter((s) => s !== id) : [...f.symptoms, id],
    }));

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG, PNG o WebP).");
      return;
    }
    try {
      setError(null);
      set("photo", await compressImage(file));
    } catch {
      setError("No pudimos leer la imagen. Prueba con otra foto.");
    }
  };

  const hasAppearance = Object.values(form.appearance).some(Boolean);
  const canSubmit =
    form.ageYears !== "" && (form.symptoms.length > 0 || hasAppearance || (form.notes?.trim().length ?? 0) > 10);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ageYears: Number(form.ageYears) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setResult(data);
      setStatus("done");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
      setStatus("error");
    }
  };

  const reset = () => {
    setForm(INITIAL);
    setResult(null);
    setStatus("idle");
    setError(null);
    if (fileInput.current) fileInput.current.value = "";
    document.getElementById("encuesta")?.scrollIntoView({ behavior: "smooth" });
  };

  if (status === "done" && result) {
    return (
      <div ref={resultRef} className="scroll-mt-8">
        <ResultCard data={result} species={form.species} name={form.name || undefined} onReset={reset} />
        <AdSlot slot="2222222222" />
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Columna izquierda */}
        <div className="space-y-7">
          <div>
            <span className="field-label">¿Es un perro o un gato?</span>
            <div className="segment grid-cols-2">
              {(["perro", "gato"] as const).map((sp) => (
                <button key={sp} type="button" data-active={form.species === sp} onClick={() => set("species", sp)}>
                  {sp === "perro" ? "🐶 Perro" : "🐱 Gato"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="field-label">
                Nombre <span className="font-normal text-ink/45">(opcional)</span>
              </label>
              <input
                id="name"
                className="input"
                placeholder="Ej. Luna"
                value={form.name ?? ""}
                onChange={(e) => set("name", e.target.value)}
                maxLength={40}
              />
            </div>
            <div>
              <label htmlFor="age" className="field-label">
                Edad (años)
              </label>
              <input
                id="age"
                className="input"
                type="number"
                inputMode="decimal"
                min={0}
                max={30}
                step={0.5}
                placeholder="Ej. 3 (usa 0.5 si es cachorro)"
                value={form.ageYears}
                onChange={(e) => set("ageYears", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <span className="field-label">Sexo</span>
            <div className="segment grid-cols-3">
              {(
                [
                  ["macho", "Macho"],
                  ["hembra", "Hembra"],
                  ["no_se", "No sé"],
                ] as const
              ).map(([v, l]) => (
                <button key={v} type="button" data-active={form.sex === v} onClick={() => set("sex", v)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="field-label">¿Qué síntomas has notado?</span>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="chip"
                  data-active={form.symptoms.includes(s.id)}
                  onClick={() => toggleSymptom(s.id)}
                  aria-pressed={form.symptoms.includes(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="field-label">
              ¿Cómo se ve? <span className="font-normal text-ink/45">(toca lo que más se parezca; opcional)</span>
            </span>
            <AppearancePicker
              species={form.species}
              value={form.appearance}
              onChange={(appearance) => set("appearance", appearance)}
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-7">
          <div>
            <label htmlFor="duration" className="field-label">
              ¿Desde cuándo?
            </label>
            <select
              id="duration"
              className="input"
              value={form.duration}
              onChange={(e) => set("duration", e.target.value as FormState["duration"])}
            >
              <option value="horas">Menos de 24 horas</option>
              <option value="1_2_dias">1 a 2 días</option>
              <option value="3_7_dias">3 a 7 días</option>
              <option value="mas_1_semana">Más de una semana</option>
            </select>
          </div>

          <div>
            <span className="field-label">¿Qué tan grave lo ves?</span>
            <div className="segment grid-cols-3">
              {(
                [
                  ["leve", "Leve"],
                  ["moderado", "Moderado"],
                  ["grave", "Grave"],
                ] as const
              ).map(([v, l]) => (
                <button key={v} type="button" data-active={form.severity === v} onClick={() => set("severity", v)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="field-label">Apetito</span>
              <div className="segment grid-cols-3">
                {(
                  [
                    ["normal", "Normal"],
                    ["menos", "Menos"],
                    ["nada", "Nada"],
                  ] as const
                ).map(([v, l]) => (
                  <button key={v} type="button" data-active={form.eating === v} onClick={() => set("eating", v)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="field-label">Comportamiento</span>
              <div className="segment grid-cols-3">
                {(
                  [
                    ["normal", "Normal"],
                    ["algo_raro", "Algo raro"],
                    ["muy_distinto", "Muy distinto"],
                  ] as const
                ).map(([v, l]) => (
                  <button key={v} type="button" data-active={form.behavior === v} onClick={() => set("behavior", v)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="field-label">
              Cuéntanos más <span className="font-normal text-ink/45">(opcional)</span>
            </label>
            <textarea
              id="notes"
              className="input min-h-[110px] resize-y"
              placeholder="Ej. Ayer comió un hueso de pollo, hoy vomitó dos veces y no quiere caminar..."
              maxLength={800}
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          <div>
            <span className="field-label">
              Foto <span className="font-normal text-ink/45">(opcional, pero ayuda mucho)</span>
            </span>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onPhoto(e.target.files?.[0])}
            />
            {form.photo ? (
              <div className="flex items-center gap-4 rounded-xl border border-sand-200 bg-sand-50 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.photo} alt="Foto de la mascota" className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1 text-sm text-ink/70">Foto lista para analizar.</div>
                <button type="button" className="btn-ghost !py-2" onClick={() => fileInput.current?.click()}>
                  Cambiar
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-600 hover:underline"
                  onClick={() => {
                    set("photo", null);
                    if (fileInput.current) fileInput.current.value = "";
                  }}
                >
                  Quitar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sand-200 bg-sand-50/60 px-4 py-8 text-center transition hover:border-brand-300 hover:bg-brand-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8 text-brand-500" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <circle cx="12" cy="12" r="3.5" />
                  <path d="M8 5l1-2h6l1 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-semibold text-brand-800">Tomar o subir una foto</span>
                <span className="text-xs text-ink/50">De la zona afectada, los ojos, la piel o la postura general</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink/50">
          Marca al menos un síntoma, una observación visual o describe lo que pasa para continuar. Tus datos no se almacenan.
        </p>
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={!canSubmit || status === "loading"}>
          {status === "loading" ? (
            <>
              <Spinner /> Analizando…
            </>
          ) : (
            "Obtener orientación"
          )}
        </button>
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
