let text = document.getElementById("text")
let canvas = document.getElementById("word_cloud")
let ctx = canvas.getContext("2d")

function run()  {
    let wordArray = getWordArray(text.value)
    
    let maxFontSize = 100
    let fontScale = maxFontSize / wordArray[0][1]

    let words = []
    for (let w of wordArray) {
        let word = w[0]
        let occurances = w[1]
        
        let color = "#"
        let possibleValues = ["4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "f"]
        for (let i = 0; i < 6; i++) {
            color += possibleValues[Math.floor(Math.random() * possibleValues.length)]
        }

        ctx.font = (occurances * fontScale) + "px Arial"
        let textMetrics = ctx.measureText(word)
        let textWidth = textMetrics.width
        let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent

        let x
        let y
        if (words.length == 0) {
            x = -textWidth / 2
            y = textHeight / 2
        } else {
            x = words[0].boundingBox[0]
            y = words[0].boundingBox[3]
        }
        while (true) {
            let boundingBox = [x, x + textWidth, y - textHeight, y]
            let overlaps = false
            for (w of words) {
                if (rectanglesOverlap(boundingBox, w.boundingBox)) {
                    overlaps = true
                    break
                }
            }
            
            if (overlaps) {
                if (Math.random() < 0.5) {
                    if (Math.random() < 0.5) {
                        x += maxFontSize / 10
                    } else {
                        x -= maxFontSize / 10
                    }
                } else {
                    if (Math.random() < 0.5) {
                        y += maxFontSize / 10
                    } else {
                        y -= maxFontSize / 10
                    }
                }
            } else {
                words.push(new Word(word, boundingBox, color, ctx.font))
                break
            }
            
        }
    }

    let minX = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY
    let maxTextWidth = Number.NEGATIVE_INFINITY
    for (let w of words) {
        if (w.boundingBox[0] < minX) {
            minX = w.boundingBox[0]
        }
        if (w.boundingBox[1] > maxX) {
            maxX = w.boundingBox[1]
        }
        if (w.boundingBox[3] < minY) {
            minY = w.boundingBox[3]
        }
        if (w.boundingBox[2] > maxY) {
            maxY = w.boundingBox[2]
        }
        let textWidth = w.boundingBox[1] - w.boundingBox[0]
        if (textWidth > maxTextWidth) {
            maxTextWidth = textWidth
        }
    }
    canvas.width = maxX - minX + maxTextWidth
    canvas.height = maxY - minY + maxTextWidth

    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let w of words) {
        ctx.fillStyle = w.color
        ctx.font = w.font
        ctx.fillText(w.word, w.boundingBox[0] + (canvas.width / 2), w.boundingBox[3] + (canvas.height / 2))
    }
}

function getWordArray(text) {
    text = text.toLowerCase()
    let words = text.split(/[ \t\n,.?!:()_/\\]+/)

    // not a complete list
    let bannedWords = [
        "a", "am", "an", "and", "are",
        "at", "but", "for", "from", "he",
        "her", "hers", "i", "in", "is",
        "it", "its", "me", "mine", "my",
        "no", "nor", "not", "of", "on",
        "or", "ours", "she", "so", "the",
        "theirs", "them", "they", "to", "was",
        "we", "were", "will", "yes", "yet",
        "you","your","yours"
    ]

    let wordAssociativeArray = {}
    for (let w of words) {
        if (!bannedWords.includes(w)) {
            if (w in wordAssociativeArray) {
                wordAssociativeArray[w] += 1
            } else {
                wordAssociativeArray[w] = 1
            }
        }
    }

    let wordArray = []
    for (let k of Object.keys(wordAssociativeArray)) {
        wordArray.push([k, wordAssociativeArray[k]])
    }
    wordArray.sort(function(a, b) {
        return b[1] - a[1]
    })
    return wordArray
}

function rectanglesOverlap(rectangle1, rectangle2) {
    return !(rectangle1[1] < rectangle2[0] || rectangle1[0] > rectangle2[1] || rectangle1[2] > rectangle2[3] || rectangle1[3] < rectangle2[2])
}