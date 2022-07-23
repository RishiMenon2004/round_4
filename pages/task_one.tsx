import Footer from "../components/Footer"
import HeadTemplate from "../components/HeadTemplate"
import styles from "../styles/Home.module.scss"
import pageLockData from '../data/locks.json'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import answers from '../data/answers.json'

const Task1 = () => {

	let taskText = "task_one"
	const [teamName, setTeamName] = useState<string>("")
	const [complete, setComplete] = useState<number>(0)
	
	const { register, handleSubmit, formState: {errors}, setValue } = useForm({
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
	})
	const [hasSubmitted, setHasSubmitted] = useState(false)

	useEffect(() => {
		const clientTeamName = localStorage.getItem('teamName')
		setTeamName(clientTeamName !== null ? clientTeamName : "")

		let errLength = Object.keys(errors).length 

		let completePercent = errLength > 0 ? 3 - errLength : 0

		setComplete(completePercent)

		let answers = {
			1: localStorage.getItem("taskOne.1"),
			2: localStorage.getItem("taskOne.2"),
			3: localStorage.getItem("taskOne.3")
		}

		if (answers[1] !== null && answers[2] !== null && answers[3] !== null) {
			setValue("answer_1", answers[1])
			setValue("answer_2", answers[2])
			setValue("answer_3", answers[3])
			setHasSubmitted(true)
			setComplete(3)
		} else {
			setHasSubmitted(false)
			localStorage.removeItem("taskOne.1")
			localStorage.removeItem("taskOne.2")
			localStorage.removeItem("taskOne.3")
			const response = fetch(`/api/lock/task_two`, {
				method: "POST",
				body: JSON.stringify({
					teamName: clientTeamName
				})
			})
		}
	})

	const onSubmit = async (data:any) => {
		const clientTeamName = localStorage.getItem('teamName')
		if (data) {
			const response = await fetch(`/api/unlock/task_two`, {
				method: "POST",
				body: JSON.stringify({
					teamName: clientTeamName
				})
			})

			if (response.status === 200) {
				localStorage.setItem("taskOne.1", data.answer_1)
				localStorage.setItem("taskOne.2", data.answer_2)
				localStorage.setItem("taskOne.3", data.answer_3)
				setHasSubmitted(true)
				setComplete(3)
			}
		}
	}

	const task = () => {
		const teamNames = Object.keys(pageLockData)
		if (teamNames.includes(teamName)) {
			return pageLockData[`${teamName}`][`${taskText}`]
		}
	}

	return (<>
		<HeadTemplate title={taskText} description="Truth or Debug Round 4 Task 1"/>
		<div className={styles.container}>
			<div className={styles.content}>
				{task() ? <h1>{taskText} is locked</h1> : <>
					<h1>{teamName}/{taskText}</h1>
					<div className={styles.files_container}>
						<a className="directory_button" href={`/${taskText}/1.txt`} download="1.txt">1.txt</a>
						<a className="directory_button" href={`/${taskText}/2.txt`} download="2.txt">2.txt</a>
						<a className="directory_button" href={`/${taskText}/3.txt`} download="3.txt">3.txt</a>
						<a className="directory_button" href={`/${taskText}/key.txt`} download="key.txt">key.txt</a>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<label htmlFor="answer_1"><p>answer_1: {errors?.answer_1 && "❌"}</p></label>
						<textarea {...register("answer_1", {
							validate: (val) => {
								return val === answers.task_one[1]
							}
						})} readOnly={hasSubmitted}/>
						<label htmlFor="answer_2"><p>answer_2: {errors?.answer_2 && "❌"}</p></label>
						<textarea {...register("answer_2", {
							validate: (val) => {
								return val === answers.task_one[2]
							}
						})} readOnly={hasSubmitted}/>
						<label htmlFor="answer_3"><p>answer_3: {errors?.answer_3 && "❌"}</p></label>
						<textarea {...register("answer_3", {
							validate: (val) => {
								return val === answers.task_one[3]
							}
						})} readOnly={hasSubmitted}/>
						<button type={'submit'}  disabled={hasSubmitted}>{hasSubmitted && '> '} check_answers {complete}/3</button>
					</form>
				</>}
			</div>
			<Footer />
		</div>
	</>)
}

export default Task1