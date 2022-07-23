import HeadTemplate from "../components/HeadTemplate"
import styles from '../styles/Home.module.scss'
import pageLockData from '../data/locks.json'
import Footer from "../components/Footer"

const Locks = () => {
	return (<>
		<HeadTemplate title="Page Lock Settings" description="A"/>
		<div className={styles.container}>
			<div className={styles.content}>
				<h1>/teams</h1>
				<div style={{width: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", paddingRight: "3rem" }}>
					{Object.keys(pageLockData).map((team:any, index:number) => {
						return <div key={index}>
							<div className="directory_button" style={{marginLeft: "3rem", fontSize: "2rem", marginBlock: "1em"}} key={index}>{team}</div>
							{Object.keys(pageLockData[team]).map((task:any, index:number) => {
								return <div className="directory_button" style={{marginLeft: "4rem", fontSize: "1.5rem", marginBlock: "1em"}} key={index}>{task}: {Object.values(pageLockData[team])[index] ? 'locked' : 'unlocked'}</div>
							})}
						</div>
					})}
				</div>
			</div>
			<Footer/>
		</div>
	</>)
}

export default Locks