//This is script config file
console.log(`script config load.`)

//modify config
const { Example } = CFG
Example.msg = "script configed msg!"

//optional init func
export async function init() {
    console.log(`script config init().`)
}