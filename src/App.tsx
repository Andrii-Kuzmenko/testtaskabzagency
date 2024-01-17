import React, { useState } from 'react';
import { CardsSection } from './components/CardsSection';
import { Container } from './components/Container';
import { Header } from './components/Header';
import { TopSection } from './components/TopSection';
import { Form } from './components/Form';
import styles from './App.module.scss';

const App: React.FC = () => {
	const [page, setPage] = useState<number>(1);
	const [triggerPage, setTriggerPage] = useState<boolean>(false);

	return (
		<>
			<Header />
			<main className={styles.main}>
				<TopSection />
				<Container>
					<CardsSection
						page={page}
						triggerPage={triggerPage}
						setPage={setPage}
					/>
					<Form page={page} setPage={setPage} setTriggerPage={setTriggerPage} />
				</Container>
			</main>
		</>
	);
};

export default App;
