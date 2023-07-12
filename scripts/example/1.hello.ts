//press F5 will start "tsc -w" background task and run current script
//should be able to see the log files in the ".autor" folder, also support debug through breakpoints
import Autor from "autor"

const autor = Autor()

//stdout will not save to file in default, can enable via config
console.log("hello autor!")

//open a console witch can log to default console and also save to file
const xconsole = autor.logger.open_xconsole("x.log")
xconsole.log("hello autor!")

//error show log to "err.log" file, can disable via config
throw "example error"
