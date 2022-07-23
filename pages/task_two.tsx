import Footer from "../components/Footer"
import HeadTemplate from "../components/HeadTemplate"
import styles from "../styles/Home.module.scss"
import pageLockData from '../data/locks.json'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import answers from '../data/answers.json'

const Task3 = () => {

	let taskText = "task_two"
	const [teamName, setTeamName] = useState<string>("")
	const { register, handleSubmit, formState: {errors}, setValue } = useForm({
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
	})
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [complete, setComplete] = useState<number>(0)

	useEffect(() => {
		const clientTeamName = localStorage.getItem('teamName')
		setTeamName(clientTeamName !== null ? clientTeamName : "")

		let errLength = Object.keys(errors).length 

		let completePercent = errLength > 0 ? 3 - errLength : 0

		setComplete(completePercent)

		let answers = {
			1: localStorage.getItem("taskTwo.1"),
			2: localStorage.getItem("taskTwo.2"),
			3: localStorage.getItem("taskTwo.3")
		}

		if (answers[1] !== null && answers[2] !== null && answers[3] !== null) {
			setValue("answer_1", answers[1])
			setValue("answer_2", answers[2])
			setValue("answer_3", answers[3])
			setHasSubmitted(true)
			setComplete(3)
		}
	})

	const onSubmit = async (data:any) => {
		const clientTeamName = localStorage.getItem('teamName')
		if (data) {
			const response = await fetch(`/api/unlock/task_three`, {
				method: "POST",
				body: JSON.stringify({
					teamName: clientTeamName
				})
			})

			if (response.status === 200) {
				localStorage.setItem("taskTwo.1", data.answer_1)
				localStorage.setItem("taskTwo.2", data.answer_2)
				localStorage.setItem("taskTwo.3", data.answer_3)
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
		<HeadTemplate title={taskText} description="Truth or Debug Round 4 Task 2"/>
		<div className={styles.container}>
			<div className={styles.content}>
				{task() ? <h1>{taskText} is locked</h1> : <>
					<h1>{teamName}/{taskText}</h1>
					<div className={styles.files_container}>
						<a className="directory_button" href={`/${taskText}/1.txt`} download="1.txt">1.txt</a>
						<a className="directory_button" href={`/${taskText}/2.txt`} download="2.txt">2.txt</a>
						<a className="directory_button" href={`/${taskText}/3.txt`} download="3.txt">3.txt</a>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<label htmlFor="answer_1"><p>answer_1: {errors?.answer_1 && "❌"}</p></label>
						<textarea {...register("answer_1", {
							validate: (val) => {
								return val === answers.task_two[1]
							}
						})} readOnly={hasSubmitted}/>
						<label htmlFor="answer_2"><p>answer_2: {errors?.answer_2 && "❌"}</p></label>
						<textarea {...register("answer_2", {
							validate: (val) => {
								return val === answers.task_two[2]
							}
						})} readOnly={hasSubmitted}/>
						<label htmlFor="answer_3"><p>answer_3: {errors?.answer_3 && "❌"}</p></label>
						<textarea {...register("answer_3", {
							validate: (val) => {
								return val === answers.task_two[3]
							}
						})} readOnly={hasSubmitted}/>
						<button type={'submit'}  disabled={hasSubmitted}>{hasSubmitted && '> '}check_answers {complete}/3</button>
					</form>
				</>}
			</div>
			<Footer />
		</div>
	</>)
}

export default Task3