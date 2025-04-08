#let student = json("data.json")

#let student_name = student.student.name
#let student_birthday = student.student.birthday

#let wordmark = [#text(fill: rgb("#e52b26"),[A])#text(fill: rgb("#f59b32"),[M])#text(fill: rgb("#94c11f"),[S])#text(fill: rgb("#4bc2f1"),[E])#text(fill: rgb("#603a8e"),[L])]

#set page(margin: (x: 1.75cm, y: 2.5cm), paper: "a4")

//#set text(font: "Maiandra GD", size: 14pt, lang: "de") 
#set text(font: "Inter", size: 14pt, lang: "de")
#set par(justify: true)

#grid(
  columns: (1fr, auto),
  rows: (auto),
  [
    #image("amsel.jpg", width: 100pt)
  ],
  [
    #set align(left)
    #text(size: 12pt, fill: rgb("#95c120"), [
    #text(size: 18pt, [Grundschule]) #text(size: 20pt, wordmark) \
    staatl. genehmigte Ersatzschule \
    in privater Trägerschaft \
    Geilenkirchener Str. 54, \
    52538 Gangelt-Birgden
    ])
  ]
)

#v(1fr)

#set align(center)

#text(size: 28pt, weight: "bold", [Dein Schuljahr 2024/25 \ 1. Halbjahr])


#text(size: 14pt, fill: rgb("#95c120"), [an der freien aktiven Grundschule])

#text(size: 40pt, top-edge: 14pt, bottom-edge: 0pt, par(spacing: 1em, wordmark))
#v(-4pt)
#text(size: 14pt, top-edge: 0pt, par(spacing: 1em, [für]))
#v(-0pt)
#text(size: 40pt, fill: rgb("#95c120"), par(spacing: 0em, [#student_name]))
#v(8pt)
geb. #student_birthday


#v(2fr)

#set align(right)


#text(size: 12pt, par(spacing: 1em, [Gangelt, den 31.01.2025]))

#v(1cm)

#set align(left)

//#set text(font: "Maiandra GD", fill: rgb("#000000"), size: 12pt, lang: "de")
#set text(font: "Inter", fill: rgb("#000000"), size: 12pt, lang: "de")

#pagebreak()

//

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
