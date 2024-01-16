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
			<h3 className={styles.name} title={name}>
				{name}
			</h3>
			<div>
        <p className={styles.description} title={position}>
          {position}
        </p>
        <p className={styles.description} title={email}>
          {email}
        </p>
        <p className={styles.description} title={formatPhoneNumber(phone)}>
          {formatPhoneNumber(phone)}
        </p>
      </div>
		</article>
	);
};
