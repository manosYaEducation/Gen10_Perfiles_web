# AGENTS.md — Flujo de trabajo Git de la empresa

Este archivo define cómo el agente debe trabajar con Git en este proyecto.
Aplica siempre, en cada tarea que implique crear ramas, hacer commits, o abrir PRs.

---

## 1. Ramas: nomenclatura obligatoria

Nunca trabajar directo en `main`. Nunca crear una rama sin seguir este formato exacto.

| Tipo | Formato | Ejemplo |
|---|---|---|
| Feature | `Feature/<Autor>/<YYYY-MM-DD>-<descripcion-corta>` | `Feature/Sebastian/2026-05-12-creacion-navbar` |
| Fix | `Fix/<Autor>/<YYYY-MM-DD>-<descripcion-corta>` (o `Fix/Back-end/...`, `Fix/Front-end/...`) | `Fix/Sebastian/2026-05-03-correccion-carga` |
| Release | `Release/<Autor>/<YYYY-MM-DD>` o `Release/<YYYY-MM-DD>` | `Release/2026-05-30` |
| Hotfix | `Hotfix/<YYYY-MM-DD>-<descripcion-corta>` | `Hotfix/2026-05-30-caida-login` |

Reglas al crear una rama:
- Siempre partir desde el último `Release` activo, no desde `main` (salvo al crear el propio Release, que nace de `main`).
- La descripción va en minúsculas, con guiones, sin tildes ni espacios.
- Antes de crear la rama: `git checkout Release/<fecha-activa> && git pull origin Release/<fecha-activa>`.

## 2. Commits: Conventional Commits obligatorio

Formato: `<tipo>(<alcance opcional>): <descripción breve, minúsculas, modo imperativo>`

Tipos permitidos — usar solo estos:
- `feat` — nueva funcionalidad
- `fix` — corrección de un error
- `docs` — cambios de documentación
- `style` — cambios que no afectan lógica (formato, espaciado, punto y coma)
- `refactor` — cambio que no es fix ni feat
- `perf` — mejora de rendimiento
- `test` — pruebas
- `chore` — build, tooling, dependencias

Nunca generar mensajes genéricos ("cambios", "fix", "arreglos"). Si el cambio es difícil de resumir en un commit, es señal de dividirlo en commits más atómicos — preferir varios commits pequeños a uno grande.

Ejemplos válidos:
- `feat: agregar sistema de autenticación JWT`
- `fix(perfil): resolver superposición de imágenes`
- `perf(db): optimizar consultas SQL`

## 3. Flujo paso a paso al iniciar una tarea

1. Sincronizar con el último Release:
   ```bash
   git checkout Release/<fecha-activa>
   git pull origin Release/<fecha-activa>
   ```
2. Crear la rama Feature/Fix con la nomenclatura de la sección 1.
3. Commits atómicos y frecuentes durante el desarrollo.
4. `git push -u origin <rama>` regularmente (no dejarlo solo para el final).

## 4. Integración (Pull Request)

- Nunca hacer merge directo en local a Release o main.
- El PR va desde la rama `Feature/...` o `Fix/...` hacia la rama `Release` activa (o `main` solo si el flujo lo amerita explícitamente).
- Requiere al menos una revisión (Code Review) antes de aprobar.
- Si hay conflictos, resolverlos en la propia rama Feature/Fix, nunca reescribiendo el historial de Release:
  ```bash
  git fetch origin
  git merge origin/Release/<fecha-activa>
  # resolver conflictos
  git commit -m "Merge branch 'Release/<fecha-activa>' into <rama>"
  git push origin <rama>
  ```
- Preferencia de merge en GitHub: Merge Commit o Squash and Merge (ambos aceptados; Squash para limpiar historial de commits pequeños).

## 5. Proceso de Release

1. Se crea desde `main`: `git checkout -b Release/<fecha> main`.
2. Las Features/Fixes se integran ahí durante el ciclo.
3. En esta rama solo se aceptan `fix`, no `feat`, una vez que entra en estabilización.
4. Cierre a producción:
   ```bash
   git checkout main
   git merge --no-ff Release/<fecha>
   git tag -a v<version> -m "Versión <version>: <resumen>"
   git push origin main --tags
   ```

## 6. Resolución de conflictos (checklist)

1. `git fetch`
2. `git merge <rama-destino>`
3. Resolver manualmente las marcas `<<<<<<<`, `=======`, `>>>>>>>`
4. `git add <archivo-resuelto>`
5. `git commit`

## 7. Reglas de oro — nunca romper estas

1. **Nunca** modificar `main` directamente. Todo pasa por rama + PR/Release.
2. Tras un merge exitoso a Release/main, **eliminar la rama de origen** (local y remoto):
   ```bash
   git branch -d Feature/<rama>
   git push origin --delete Feature/<rama>
   ```
3. El código debe correr y compilar sin errores antes de abrir un PR.
4. Push diario de la rama en curso — no acumular trabajo sin respaldo remoto.
5. Revisar `.gitignore` antes de cada commit: nunca subir `node_modules`, compilados (`.exe`, `output.css` generado), ni archivos `.env`.

---
*Basado en GIT_WORKFLOW.md de la empresa (última actualización: mayo 2026).*
