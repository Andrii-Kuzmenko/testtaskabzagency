import { Button } from '../Button';
import { Logo } from '../icons/Logo';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<a href='/'>
					<Logo className={`${styles.logo} `} />
				</a>
				<ul className={styles.buttonsGroup}>
					<li>
						<a href='#users'>
							<Button children={'Users'} />
						</a>
					</li>
					<li>
						<a href='#form'>
							<Button children={'Sign up'} />
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};
