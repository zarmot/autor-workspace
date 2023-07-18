import Autor from "autor"

await Autor()

const data1 = {
	value: 0
}
const data2 = {
	text: "A"
}
const data3 = {
	value: 1
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
	useScript(async function* () {
		//rerender when yield
		await wait(1000)
		data2.text = "B"
		yield

		await wait(1000)
		data2.text = "C"
		yield

		await wait(1000)
		data2.text = "F"
		yield
	})

	//Example3
	//multiple scripts, can use "return" to end a step 
	useScripts([
		async function* step1() {
			await wait(500)
			data3.value++
			yield

			await wait(500)
			data3.value++
			yield

			await wait(500)
			data3.value++
			yield
		},
		async function* step2() {
			await wait(500)
			data3.value++
			yield

			await wait(500)
			data3.value++
			yield
		},
		async function* step3() {
			await wait(500)
			data3.value++
			yield
		},
	])

	//Example4
	const data4 = useScript(async function* () {
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

	return <Ink.Text color="blue">{data1.value}.{data2.text}{data3.value}{data4?.text}</Ink.Text>
})