import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { Row, Col, Card, Container } from 'react-bootstrap'
import './App.css'
import Home from './Pages/Home'

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
			</Routes>
		</Router>
	)
}

export default App
