import React from "react";
import styles from './ErrorMessage.module.scss';

export const ErrorMessage = React.memo(() => (
	<h2 className={styles.title}>Something went wrong!!!</h2>
));
