import React, { useState } from 'react';
import { CardsSection } from './components/CardsSection';
import { Container } from './components/Container';
import { Header } from './components/Header';
import { TopSection } from './components/TopSection';
import styles from './App.module.scss';
import { Form } from './components/Form';

const App: React.FC = () => {
	const [page, setPage] = useState<number>(1);
	console.log(setPage);

	return (
		<>
			<Header />
			<main className={styles.main}>
				<TopSection />
				<Container>
					<CardsSection page={page} setPage={setPage} />
					<Form setPage={setPage} />
				</Container>
			</main>
		</>
	);
};

export default App;
