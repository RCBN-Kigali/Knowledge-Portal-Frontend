// Canonical career options teachers can attach to content. `id` is the stored
// value; `label` is shown in dropdowns and on content. The richer presentation
// (icons, pathways) lives in CareerExplorer's careerData, keyed by the same id.
export const careerOptions = [
  { id: 'medicine', label: 'Medicine & Healthcare' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'technology', label: 'Technology & IT' },
  { id: 'teaching', label: 'Education & Teaching' },
  { id: 'law', label: 'Law & Justice' },
  { id: 'arts', label: 'Creative Arts' },
] as const

export function careerLabel(id: string | null): string | null {
  if (!id) return null
  return careerOptions.find((c) => c.id === id)?.label ?? id
}
