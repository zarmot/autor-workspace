//press F5 will start "tsc -w" background task and run current script
//should be able to see the log files in the ".autor/log" folder, also support debug through breakpoints
import "autor"

//stdout will not save to file in default, can enable via "Alib.config.log.outlog = true" like above
console.log("hello autor!")

//open a console witch can log to default console and also save to file
const xconsole = Log.open_xconsole("x.log")
xconsole.log("hello autor!")

//error show log to "err.log" file, can disable via "Alib.config.log.errlog = false"
throw "example error"