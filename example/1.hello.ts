//press F5 will start "tsc -w" background task and run current script
//should be able to see the log files in the ".autor/log" folder, also support debug through breakpoints
import Autor from "autor"

await Autor(() => {
  //you can change config here
  //this parameter is optional, you can directly call "Autor()" 
})

//stdout will not save to file in default, can enable via "cfg.log.outlog = true"
console.log("hello autor!")

//open a console witch can log to default console and also save to file
const xconsole = Log.open_xconsole("x.log")
xconsole.log("hello autor!")

//error show log to "err.log" file, can disable via "cfg.log.errlog = false"
throw "example error"
