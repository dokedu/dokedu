const { oklch, rgb, formatHex } = require("culori")
import fs from "fs/promises"

function oklchToHex(l, c, h) {
  const color = oklch(`oklch(${l} ${c} ${h})`)
  return formatHex(color)
}

async function extractColorTokens(number): any {
  const dataFile = await fs.readFile(import.meta.dir + "/color.txt")
  const cssString = dataFile.toString()

  const regex = new RegExp(`--color-([a-z]+)-${number}: oklch\\((\\d+\\.\\d+) (\\d+\\.\\d+) ([\\d\\.]+)\\);`, "g")

  const colors = {}
  let match

  while ((match = regex.exec(cssString)) !== null) {
    const [_, colorName, l, c, h] = match
    const hexColor = oklchToHex(l, c, h)
    colors[colorName] = hexColor
  }

  return colors
}

// Example usage:

const tokens = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

let resl = {}

for (const token of tokens) {
  resl[token] = await extractColorTokens(token)
}

console.log(JSON.stringify(resl, undefined, 2))
