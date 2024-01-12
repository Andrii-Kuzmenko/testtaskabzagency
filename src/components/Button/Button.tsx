import React, { DetailedHTMLProps } from 'react';
import styles from './Button.module.scss';

interface Props
	extends DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	onClick?: () => void;
	children: React.ReactNode | string;
}

export const Button = React.memo<Props>(({ children, onClick, ...props }) => (
	<button className={styles.button} type='button' onClick={onClick} {...props}>
		{children}
	</button>
));
