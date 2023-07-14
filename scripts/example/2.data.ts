import Autor from "autor"

const autor = await Autor()

const datafile = "test/1"

let data = 0

//JSON.parse() from file
data = await autor.data.load(datafile) ?? data
console.log(data)

data++
//JSON.strinfy() to file
autor.data.save(datafile, data)
