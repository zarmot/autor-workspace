import "autor"

const datafile = "test/1"

let data = 0

//JSON.parse() from file
data = await Data.load(datafile) ?? data
console.log(data)

data++
//JSON.strinfy() to file
Data.save(datafile, data)
