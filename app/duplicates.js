/*
  Looks for duplicates.
  If it is unique, it is pushed to the unique list.
  Then, it writes that unique list in 'data/trainingdata.json'
*/
const fs = require('fs')
const S = require('string')
const R = require('ramda')
const data = JSON.parse(S(fs.readFileSync('data/trainingdata.json')).ensureLeft('[').ensureRight(']').replaceAll('}{', '},{').s)
const unique = []

function comparator (a, b) {
  for (var i = 0; i < 9; i++) {
    if (!(a.input[i] === b.input[i] && a.output[i] === b.output[i])) return false
    else return true
  }
}

for (var i = 0; i < data.length; i++) {
  for (var j = 0; j <= i; j++) {
    if (i === j) {
      unique.push(data[i])
    }
    if (j < i && comparator(data[i], data[j])) {
      console.log('duplicate found')
      break
    }
  }
}

console.log('generation done')

fs.writeFileSync('data/trainingdata.json', JSON.stringify(unique[0]))

const writeFile = uniq => fs.appendFileSync('data/trainingdata.json', JSON.stringify(uniq))
R.map(writeFile, unique)
