export default function useInitials(name: string | null | undefined) {
  if (!name) return ""
  if (name === "New group") return ""
  // just use the first two letters cut the rest
  return name
    .split(" ")
    .map((word) => word[0])
    .splice(0, 2)
    .join("")
}
