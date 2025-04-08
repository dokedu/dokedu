#set page(footer: context { [
    #set align(center)
    
    #text(size: 8pt, [
      Seite #counter(page).get().first() von #counter(page).final().first()
    ])
  ]})

#counter(page).update(1)

#let data = json("data.json")

#let count = counter("count")
#let n = 0

#for subject in data.competences [
  #count.step()
  
  #table(
    columns: (1fr, auto),
    inset: 8pt,
    fill: (_, row) => if calc.even(row) { rgb(subject.color) } else { white },
    stroke: rgb(subject.color200),
    align: horizon,
    text(size: 9pt + 4pt, fill: rgb(subject.color900), weight: "black", [*#subject.name*]), text(fill: rgb(subject.color900),[*Niveau*]),
    ..subject.competences.map(row => (
      text(fill: rgb(subject.color900),[#row.name]),
      align(center, grid(columns: (auto, auto, auto), gutter: 2pt, inset: 0pt, align: bottom, 
          if row.level >= 1 [
            #rect(width: 4pt, height: 6pt, fill: rgb(subject.color900), radius: 1pt)
          ] else [
            #rect(width: 4pt, height: 6pt, fill: rgb(subject.color200), radius: 1pt)
          ],
          if row.level >= 2 [
            #rect(width: 4pt, height: 10pt, fill: rgb(subject.color900), radius: 1pt)
          ] else [
            #rect(width: 4pt, height: 10pt, fill: rgb(subject.color200), radius: 1pt)
          ],
          if row.level >= 3 [
            #rect(width: 4pt, height: 14pt, fill: rgb(subject.color900), radius: 1pt)
          ] else [
            #rect(width: 4pt, height: 14pt, fill: rgb(subject.color200), radius: 1pt)
          ]
        ))
      ,
      )
    ).flatten(),
  )

  #context [
      #if data.competences.len() > count.get().first() [
        #pagebreak()
    ]
  ]
]