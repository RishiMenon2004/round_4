import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter  } from "next/router"
import Footer from "../components/Footer"
import answers from "../data/answers.json"
import winners from "../data/winners.json"

import styles from "../styles/home.module.scss"

const TheEnd = () => {

	const router = useRouter()

	const { register, handleSubmit, formState: {errors}, setValue } = useForm()
	
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [complete, setComplete] = useState<number>(0)
	const [teamName, setTeamName] = useState<string>("")

	const onSubmit = async (data:any) => {
		if (data) {
			const response = await fetch(`/api/winner/${teamName}`)
			if (response.status === 200) {
				localStorage.setItem("taskOne.key", data.task_1_key)
				localStorage.setItem("taskTwo.key", data.task_2_key)
				localStorage.setItem("taskThree.key", data.task_3_key)
				setHasSubmitted(true)
				setComplete(3)
			}
		}
	}

	useEffect(() => {
		const clientTeamName = localStorage.getItem('teamName')
		setTeamName(clientTeamName !== null ? clientTeamName : "")

		let errLength = Object.keys(errors).length 

		let completePercent = errLength > 0 ? 3 - errLength : 0

		setComplete(completePercent)

		let answers = {
			1: localStorage.getItem("taskOne.key"),
			2: localStorage.getItem("taskTwo.key"),
			3: localStorage.getItem("taskThree.key")
		}

		if (answers[1] !== null && answers[2] !== null && answers[3] !== null) {
			setValue("task_1_key", answers[1])
			setValue("task_2_key", answers[2])
			setValue("task_3_key", answers[3])
			setHasSubmitted(true)
			setComplete(3)
		} else {
			setHasSubmitted(false)
			localStorage.removeItem("taskOne.key")
			localStorage.removeItem("taskTwo.key")
			localStorage.removeItem("taskThree.key")
		}
	})

	return <>
		<div className={styles.container}>
			<div className={styles.content}>
				<h1>{teamName}/the_end</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<label htmlFor="answer_1"><p>key_1: {errors?.task_1_key && "❌"}</p></label>
					<textarea {...register("task_1_key", {
						required: true,
						validate: (value) => {
							return value === answers.task_one.key
						}
					})} />
					<label htmlFor="answer_1"><p>key_2: {errors?.task_2_key && "❌"}</p></label>
					<textarea {...register("task_2_key", {
						required: true,
						validate: (value) => {
							return value === answers.task_two.key
						}
					})} />
					<label htmlFor="answer_1"><p>key_3: {errors?.task_3_key && "❌"}</p></label>
					<textarea {...register("task_3_key", {
						required: true,
						validate: (value) => {
							return value === answers.task_three.key
						}
					})} />
					<button type={'submit'}  disabled={hasSubmitted}>{hasSubmitted && '> '} check_answers {complete}/3</button>
				</form>
				{hasSubmitted && <>
					<h2>Leaderboards</h2>
					<ol>
						{winners.winners.map((winner: any, index: number) => {
							return <li key={index}>{winner}</li>
						})}
					</ol>
				</>}
			</div>
			<Footer/>
		</div>
	</>
}

export default TheEnd