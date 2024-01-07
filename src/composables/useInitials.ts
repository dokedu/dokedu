export default function useInitials(name: string | null | undefined) {
  if (!name) return ""
  if (name === "New group") return ""
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
}
