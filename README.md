# 🐾 Huella Sana

Página web profesional donde dueños de perros y gatos responden una encuesta breve, suben una foto y reciben una orientación preliminar con IA (NVIDIA NIM · Gemma 4 31B con visión, endpoint gratuito) sobre si deben acudir al veterinario: **emergencia**, **consulta pronto** u **observar en casa**.

> ⚠️ No reemplaza a un médico veterinario. Es una herramienta de orientación, no de diagnóstico.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **NVIDIA NIM** (API compatible con OpenAI, sin SDK) — modelo con visión `google/gemma-4-31b-it`, endpoint gratuito (40 RPM / 10.000 req/día)
- **Zod** para validar la encuesta y la respuesta del modelo
- Despliegue en **Vercel**

## Cómo funciona

1. El usuario llena la encuesta (`components/SurveyForm.tsx`). La foto se comprime en el navegador (JPEG, ≤170 KB en base64, el límite de imagen inline de NVIDIA) antes de enviarse.
2. `POST /api/analyze` (`app/api/analyze/route.ts`) valida los datos, construye el prompt (`lib/prompt.ts`) y llama al modelo de NVIDIA con la imagen + texto. Cambiar de proveedor es editar `NVIDIA_API_URL` / `NVIDIA_MODEL` (cualquier API compatible con OpenAI).
3. El modelo devuelve JSON estructurado (urgencia, resumen, hallazgos de la foto, señales de alarma, cuidados en casa, preguntas para el vet).
4. `lib/triage.ts` aplica **reglas de seguridad** independientes de la IA: si hay banderas rojas (dificultad respiratoria, convulsiones, tóxicos, gato macho que no orina, etc.) el resultado se fuerza a *emergencia*, incluso si la IA falla.
5. No se almacena ningún dato ni foto en nuestro servidor. Nota: el endpoint gratuito de NVIDIA puede usar las peticiones para mejorar sus servicios.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y pon tu NVIDIA_API_KEY
npm run dev                  # http://localhost:3000
```

## Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new) importa el repo (Vercel detecta Next.js automáticamente).
3. En **Environment Variables** agrega:
   - `NVIDIA_API_KEY` → tu clave gratuita de https://build.nvidia.com
   - `NVIDIA_MODEL` → `google/gemma-4-31b-it` (opcional)
4. Deploy. Cada `git push` a `main` redespliega automáticamente.

## Estructura

```
app/
  layout.tsx          # fuentes, metadata
  page.tsx            # landing + sección de encuesta
  globals.css         # tema (Tailwind v4)
  api/analyze/route.ts
components/
  SurveyForm.tsx      # formulario + compresión de foto
  ResultCard.tsx      # tarjeta de resultado
lib/
  schema.ts           # zod: encuesta y resultado
  prompt.ts           # system prompt y texto de usuario
  triage.ts           # banderas rojas (red de seguridad)
```

## Próximos pasos sugeridos

- Rate limiting en `/api/analyze` (p. ej. Vercel KV o Upstash) para controlar costos.
- Guardar resultados anónimos (con consentimiento) para investigación sobre confianza en IA.
- Directorio de veterinarias por ciudad.
