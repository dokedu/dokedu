#let data = json("data.json")

#set text(font: "Inter", size: 11pt, lang: "de")

#set page(
  margin: (x: 1.75cm, y: 2.5cm),
  header: context { [
    *Berichte*
  ]},
  footer: context { [
    #set align(center)
    #text(size: 8pt, [
      Seite #counter(page).get().first() von #counter(page).final().first()
    ])
  ]}
)

#set par(justify: true)

#set align(left)

#for entry in data.entries [
  === #entry.date

  #v(6pt)

  #entry.body
  
  #v(4pt)

  #text(fill: luma(128), [Erstellt am #entry.createdAt Uhr von #entry.user.firstName #entry.user.lastName für den #entry.date])

  #v(12pt)
]