import React from 'react';
import { Image } from '../Image';

import styles from './Card.module.scss';

type Props = {
	photo: string;
	name: string;
	position: string;
	email: string;
	phone: string;
};

export const Card: React.FC<Props> = ({
	photo,
	name,
	position,
	email,
	phone,
}) => {
	const formatPhoneNumber = (input: string) => {
		const digitsOnly = input.replace(/\D/g, '');

		if (digitsOnly.length === 12) {
			return digitsOnly.replace(
				/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
				'+$1 ($2) $3 $4 $5',
			);
		} else {
			return input;
		}
	}

	return (
		<article className={styles.article}>
			<Image className={styles.photo} src={photo} alt={name} />
			<h3 className={styles.name}>{name}</h3>
			<p className={styles.description}>
				{position}
				<br />
				{email}
				<br />
				{formatPhoneNumber(phone)}
			</p>
		</article>
	);
};
