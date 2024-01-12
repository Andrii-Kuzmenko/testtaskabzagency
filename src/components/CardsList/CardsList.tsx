import React from "react";
import { User } from '../../types/User';
import { Card } from '../Card';

import styles from './CardsList.module.scss';

type Props = {
  cards: User[];
};

export const CardsList = React.memo<Props>(({ cards }) => (
	<div className={styles.list}>
		{cards.map(card => (
			<Card
				key={card.id}
				photo={card.photo}
				name={card.name}
				position={card.position}
				email={card.email}
				phone={card.phone}
			/>
		))}
	</div>
));