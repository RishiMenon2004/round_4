import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.scss'

const Footer = () => {

	const [linkText, setLinkText] = useState(' ')
	const [hasDoneTask, setHasDoneTask] = useState(false)

	const router = useRouter()

	const goTo = (link: string) => {
		setLinkText(link)
		setTimeout(() => router.push(link), 1500)
	}

	useEffect(() => {
		const hasAnswers = localStorage.getItem('taskThree.1')
		if (hasAnswers) {
			setHasDoneTask(true)
		}

	})

	const DirectoryLink = ({href, text}: any) => {
		return (
			<div className="directory_button" tabIndex={0} onClick={() => goTo(href)}>
				<p>{text}</p>
			</div>
		)
	}

	return (<div className={`terminal_lines ${styles.footer}`}>
		<p className={styles.command_print}>ls</p>
			<div className={styles.directory}>
				<DirectoryLink href="/" text="truth_or_debug"></DirectoryLink>
				<ul>
					<li>
						<DirectoryLink href="/task_one" text="task_one" />
					</li>
					<li>
						<DirectoryLink href="/task_two" text="task_two" />
					</li>
					<li>
						<DirectoryLink href="/task_three" text="task_three" />
					</li>
					{hasDoneTask && <li>
						<DirectoryLink href="/the_end" text="the_end" />
					</li>}
				</ul>
			</div>
		<p className={styles.command_line}>{'>'} cd {linkText}</p>
	</div>)
}

export default Footer