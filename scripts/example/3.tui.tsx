import Autor from "autor"

const autor = await Autor()

const data1 = {
	value: 0
}
const data2 = {
	text: "S1"
}

render(() => {
	//Example1
	const update = useUpdate()
	useEffect(() => {
		call(async () => {
			await wait(1000)
			data1.value += 1
			update()

			await wait(1000)
			data1.value += 1
			update()

			await wait(1000)
			data1.value += 1
			update()
		})
	}, [])

	//Example2
	useScript(async function*() {
		//rerender when yield
		await wait(1000)
		data2.text = "S2"
		yield

		await wait(1000)
		data2.text = "S3"
		yield

		await wait(1000)
		data2.text = "SF"
		yield
	})

	//Example3
	const data3 = useScript(async function*()  {
		//rerender when yield
		const data = {
			text: "?"
		}
		yield data

		await wait(1000)
		data.text = ".."
		yield data

		await wait(1000)
		data.text = "..."
		yield data

		await wait(1000)
		data.text = "!"
		yield data
	})

	return <Ink.Text color="blue">{data1.value}.{data2.text}{data3?.text}</Ink.Text>
})