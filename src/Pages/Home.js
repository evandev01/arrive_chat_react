import React, { useEffect, useCallback } from 'react'
import useLocalStorage from 'use-local-storage'
import { Row, Col, Card, Container } from 'react-bootstrap'

const Home = () => {
	const [users, setUsers] = useLocalStorage('users', {})

	const handleMessage = useCallback(
		message => {
			const data = message.data
			const [userName, messageBody] = data.split(':')
			const words = messageBody.split(' ')

			setUsers(prevUsers => {
				const user = prevUsers[userName]
				const wordCount = user ? user.wordCount + words.length : words.length

				return {
					...prevUsers,
					[userName]: {
						wordCount,
					},
				}
			})
		},
		[setUsers]
	)

	const openConnection = useCallback(() => {
		const wss = new WebSocket('wss://tso-take-home-chat-room.herokuapp.com')
		let isConnected = false

		wss.onopen = () => {
			if (isConnected) {
				wss.close()
			} else {
				isConnected = true
			}
			console.log('We are connected')
		}

		wss.onclose = () => {
			isConnected = false
		}

		wss.addEventListener('message', handleMessage)
	}, [handleMessage])

	useEffect(() => {
		openConnection()
	}, [openConnection])

	return (
		<>
			<Container>
				<h1 className='text-center'>Arrive Logistics Chat</h1>
				{users &&
					Object.entries(users)
						.sort((a, b) => b[1].wordCount - a[1].wordCount)
						.map((x, i) => (
							<Row key={i} className='justify-content-md-center'>
								<Col md='auto' className='text-center m-3 p-3'>
									<Card>
										<Card.Title>{x[0]}</Card.Title>
										<Card.Subtitle>Word Count</Card.Subtitle>
										<Card.Title> {x[1].wordCount}</Card.Title>
										<Card.Body></Card.Body>
									</Card>
								</Col>
							</Row>
						))}
			</Container>
		</>
	)
}

export default Home
