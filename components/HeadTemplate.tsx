import Head from "next/head"

const HeadTemplate = ({title, description}: any) => {
	return (
		<Head>
			<title>{title}</title>
			<link rel="icon" href="/images/td_logo.png" />
			
			{/* Default */}
			<meta name="title" content={title} />
			<meta name="description" content={description} />
			<meta name="theme-color" content="#00cc22" />
		</Head>
	)
}

export default HeadTemplate