export function reportStatusText(status: string) {
  switch (status) {
    case "draft":
      return "Entwurf"
    case "in_progress":
      return "In Arbeit"
    case "in_review":
      return "In Prüfung"
    case "completed":
      return "Abgeschlossen"
  }
}
