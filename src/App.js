import React, { useEffect } from 'react'
import useLocalStorage from 'use-local-storage'
import { Row, Col, Card, Container } from 'react-bootstrap'
import './App.css'

const App = () => {
	const [users, setUsers] = useLocalStorage('users', {})

	useEffect(() => {
		let isConnected = false

		const wss = new WebSocket('wss://tso-take-home-chat-room.herokuapp.com')

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
	}, [])

	const handleMessage = message => {
		const data = message.data
		const [userName, messageBody] = data.split(':')
		const words = messageBody.split(' ')

		setUsers(prevUsers => {
			const user = prevUsers[userName]
			const wordCount = user ? user.wordCount + words.length : words.length

			const updatedUser = {
				[userName]: {
					wordCount,
				},
			}

			return {
				...prevUsers,
				[userName]: {
					wordCount,
				},
			}
		})
	}

	return (
		<div className='App'>
			<header>
				<h1 className='text-center'>Arrive Logistics Chat</h1>

				<Container>
					{users &&
						Object.entries(users)
							.sort((a, b) => b[1].wordCount - a[1].wordCount)
							.map((x, i) => (
								<Row key={i} className='justify-content-md-center'>
									<Col md='auto' className='text-center m-3 p-3'>
										<Card
											style={{
												width: '18rem',
												backgroundColor: 'white',
												color: 'black',
											}}>
											<Card.Title>{x[0]}</Card.Title>
											<Card.Subtitle>Word Count</Card.Subtitle>
											<Card.Title> {x[1].wordCount}</Card.Title>
											<Card.Body></Card.Body>
										</Card>
									</Col>
								</Row>
							))}
				</Container>
			</header>
		</div>
	)
}

export default App
