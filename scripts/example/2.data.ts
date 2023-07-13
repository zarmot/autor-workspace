import Autor from "autor"

const autor = await Autor()

const datafile = "test/1"

let data = 0
try {
  //JSON.parse() frrom file
  data = await autor.data.load(datafile)
} catch {}
console.log(data)

data++
//JSON.strinfy() to file
autor.data.save(datafile, data)
