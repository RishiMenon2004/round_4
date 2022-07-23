import Image from 'next/image'
import HeadTemplate from '../components/HeadTemplate'
import styles from '../styles/Home.module.scss'
import Footer from '../components/Footer'
import logo from '../public/images/td_logo.png'
import pageLockData from '../data/locks.json'
import anime from 'animejs'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

function Home() {
	const { register, handleSubmit, setValue } = useForm()
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [teamName, setTeamName] = useState<string>("")

	useEffect(() => {
		if (localStorage.getItem("hasPlayed") !== "true") {
			anime({
				targets: '.terminal_lines',
				opacity: [
					{ value: 0, duration: 0 },
					{ value: 1, duration: 1 }
				],
				delay: anime.stagger(750, { start: 3000 })
			})
		}
		
		localStorage.setItem("hasPlayed", "true")
	}, [])

	useEffect(() => {
		const clientTeamName = localStorage.getItem('teamName')
		if(clientTeamName !== null) {
			console.log(Object.keys(pageLockData).includes(clientTeamName))
			if (Object.keys(pageLockData).includes(clientTeamName)) {
				setTeamName(clientTeamName)
				setHasSubmitted(true)
				setValue('teamName', localStorage.getItem('teamName'))
			} else {
				setHasSubmitted(false)
				setValue("teamName", "")
				localStorage.removeItem("teamName")
			}
		}		
	},[])

	const onSubmit = async (data:any) => {
		if (data.teamName !== "") {
			const createTeam = await fetch(`/api/create_team/${data.teamName}`, {
				method: "POST"
			}).then(res => {return res.status})
			if (createTeam === 200) {
				const unlockTaskOne = await fetch('/api/unlock/task_one', {
					method: 'POST',
					body: JSON.stringify({
						teamName: data.teamName
					})
				}).then(res => {return res.status})
				
				if (unlockTaskOne === 200) {
					localStorage.setItem("teamName", data.teamName)
					setHasSubmitted(true)
				}
			}
		}
	}

	const resetName = async () => {
		const deleteTeam = await fetch(`/api/delete_team/${localStorage.getItem("teamName")}`, {
			method: "POST"
		}).then(res => {return res.status})
		if (deleteTeam === 200) {
			setHasSubmitted(false)
			setValue("teamName", "")
			localStorage.removeItem("teamName")
		}
	}
	return (<>
		<HeadTemplate title="Truth or Debug" description="Truth or Debug Index Page" />
		<div className={styles.container}>
			<div className={styles.banner}>
				<div className={styles.overlay} />
				<div className={styles.banner_text}>
					<div className={styles.command_line}>
						{`> run TD.sh`}
						<div className={styles.type_cursor} />
					</div>
				</div>

				<div className={styles.logo}>
					<Image src={logo} alt="Truth or Debug" quality={100} placeholder={"blur"} />
				</div>

				<div className={styles.banner_text}>
					<h1 id="title">Truth or Debug</h1>
				</div>
			</div>
			<div className={styles.content}>
				<p className="terminal_lines">loading...</p>
				<p className="terminal_lines">fetching tasks</p>
				<p className="terminal_lines">task_one received</p>
				<p className="terminal_lines">task_two received</p>
				<p className="terminal_lines">task_three received</p>
				<p className="terminal_lines">loading data</p>
				<p className="terminal_lines">.</p>
				<p className="terminal_lines">.</p>
				<p className="terminal_lines">.</p>
				<p className="terminal_lines">.</p>
				<p className="terminal_lines">.</p>
				<p className="terminal_lines">.</p>
				<p className="terminal_lines">.</p>
				<form className="terminal_lines" onSubmit={handleSubmit(onSubmit)}>
					<div style={{display: "flex", flexDirection: "row"}}>
						teamName: <input
							{...register("teamName", {
								maxLength: 32
							})}
							autoFocus className="terminal_lines"
							readOnly={hasSubmitted}/>
						<input type={'submit'} style={{display: "none"}} disabled={hasSubmitted}/>
						{hasSubmitted && <div onClick={resetName}>↺</div>}
					</div>
				</form> 
				{hasSubmitted && <div className='terminal_lines'><p className="terminal_lines_after">.</p>
				<p className="terminal_lines_after">.</p>
				<p className="terminal_lines_after">.</p>
				<p className="terminal_lines_after">ready</p></div>}
			</div>
			{hasSubmitted && <Footer/>}
		</div>
	</>)
}

export default Home