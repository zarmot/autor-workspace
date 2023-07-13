import Autor from "autor"

const autor = await Autor()

render(() => {
	const data = useScript(async function*()  {
		yield "1"
		await wait(1000)
		yield "2"
		await wait(1000)
		yield "3"
		await wait(1000)
		yield "F"
		return
	})

	return <Ink.Text color="blue">{data}</Ink.Text>
})