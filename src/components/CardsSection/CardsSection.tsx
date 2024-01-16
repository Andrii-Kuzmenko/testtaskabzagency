import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from '../Button';
import { CardsList } from '../CardsList';
import { User } from '../../types/User';
import { getUsers } from '../../api/users';

import styles from './CardsSection.module.scss';
import { LoaderComponent } from '../LoaderComponent/LoaderComponent';
import { ErrorMessage } from '../ErrorMessage';

type Props = {
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
};

export const CardsSection = React.memo<Props>(({ page, setPage }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [maxPage, setMaxPage] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const count = 6;

	const fetchData = async (): Promise<void> => {
		setIsLoading(true);

		try {
			setIsError(false);
			const fetchedUsers = await getUsers(page, count);

			setUsers(fetchedUsers.users);
			setMaxPage(fetchedUsers.total_pages);
		} catch {
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [page]);

	const showMore = () => {
		setPage((current: number) => current + 1);
	};

	return (
		<section id='users'>
			{!isError && (
				<div className={styles.section}>
					<h2 className={styles.title}>Working with GET request</h2>
					{isLoading ? <LoaderComponent /> : <CardsList cards={users} />}
					<Button
						className={classNames(styles.button, {
							[styles.disabled]: maxPage <= page,
						})}
						children={'Show more'}
						onClick={showMore}
					/>
				</div>
			)}
			{isError && <ErrorMessage />}
		</section>
	);
});
