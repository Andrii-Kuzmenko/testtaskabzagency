import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../Button';
import { LoaderComponent } from '../LoaderComponent';
import { ErrorMessage } from '../ErrorMessage';
import { SuccessImage } from '../icons/SuccessImage';
import { FormDataType } from '../../types/FormDataType';
import { Position } from '../../types/Position';

import { getToken } from '../../api/token';
import { postUser } from '../../api/users';
import { getPositions } from '../../api/position';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import styles from './Form.module.scss';

type Props = {
	setPage: Dispatch<SetStateAction<number>>;
};

export const Form = React.memo<Props>(({ setPage }) => {
	const [positions, setPositions] = useState<Position[]>([]);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isSent, setIsSent] = useState<boolean>(false);
	const [isError, setIsError] = useState(false);

	const fetchToken = async () => {
		try {
			const fetchedToken = await getToken();

			return fetchedToken.token;
		} catch (error) {
			setIsError(true);
		}
	};

	const fetchPositions = async () => {
		try {
			const fetchedPositions = await getPositions();

			setPositions(fetchedPositions.positions);
		} catch (error) {
			setIsError(true);
		}
	};

	useEffect(() => {
		fetchPositions();
	}, []);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormDataType>({
		mode: 'onChange',
	});

	const onSubmit: SubmitHandler<FormDataType> = async data => {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('email', data.email);
		formData.append('phone', data.phone.split(' ').join(''));
		formData.append('position_id', data.position);
		formData.append('photo', data.photo[0]);

		try {
			setIsSending(true);
			const accessToken = await fetchToken();

			if (!accessToken) {
				return;
			}

			const resp = await postUser(formData, accessToken);

			if (resp) {
				setIsSent(true);
			}
		} catch (error) {
			setIsError(true);
		} finally {
			setPage(1);
			reset();
			setIsSending(false);
		}
	};

	const normalizePhoneNumber = (value: string) => {
		if (!value) {
			return value;
		}
		const phoneNumber = parsePhoneNumberFromString(value);

		if (!phoneNumber) {
			return value;
		}

		return phoneNumber.formatInternational();
	};

	return (
		<div>
			{isSending && !isError && <LoaderComponent />}

			{!isSending && !isSent && !isError && (
				<>
					<h2 className={styles.title}>Working with POST request</h2>

					<form
						className={styles.form}
						id='form'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className={styles.inputContainer}>
							<input
								{...register('name', {
									required: 'name is required field',
									minLength: {
										value: 2,
										message: 'min length 2 char!',
									},
									maxLength: {
										value: 60,
										message: 'max length 60 char!',
									},
								})}
								className={classNames(styles.input, {
									[styles.error]: errors?.name,
								})}
								name='name'
								type='text'
								placeholder='Your name'
							/>
							{errors?.name && (
								<div className={styles.errorText}>{errors.name.message}</div>
							)}
						</div>

						<div className={styles.inputContainer}>
							<input
								{...register('email', {
									required: 'email is required field',
									pattern: {
										value:
											/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
										message: 'Please enter valid email!',
									},
									minLength: {
										value: 2,
										message: 'min length 2 char!',
									},
									maxLength: {
										value: 100,
										message: 'max length 100 char!',
									},
								})}
								className={classNames(styles.input, {
									[styles.error]: errors?.email,
								})}
								name='email'
								placeholder='Email'
							/>
							{errors?.email && (
								<div className={styles.errorText}>{errors.email.message}</div>
							)}
						</div>

						<div className={styles.inputContainer}>
							<Controller
								control={control}
								name='phone'
								rules={{
									required: 'phone is required field',
									pattern: {
										value: /^\+380/,
										message: 'Number should start with code of Ukraine +380',
									},
									minLength: {
										value: 16,
										message:
											'Number should start with code of Ukraine +380 and be followed by 9 more digits',
									},
									maxLength: {
										value: 16,
										message:
											'Number should start with code of Ukraine +380 and be followed by 9 more digits',
									},
								}}
								render={({ field: { onChange }, fieldState: { error } }) => (
									<>
										<div className={styles.phone}>
											<input
												className={classNames(styles.input, {
													[styles.error]: errors?.phone,
												})}
												name='phone'
												type='text'
												placeholder='Phone'
												onChange={e =>
													onChange(
														(e.target.value = normalizePhoneNumber(
															e.target.value,
														)),
													)
												}
											/>
											<p className={styles.phoneHint}>+380 XX XXX XXXX</p>
										</div>
										{error && (
											<div className={styles.errorText}>{error.message}</div>
										)}
									</>
								)}
							/>
						</div>

						<div className={styles.inputContainer}>
							<h3 className={styles.positionsTitle}>Select your position</h3>
							<div className={styles.positions}>
								{positions.map(position => (
									<div key={position.id} className={styles.position}>
										<input
											{...register('position', {
												required: 'position is required field',
												min: {
													value: 1,
													message: 'Min id should be 1',
												},
											})}
											className={classNames(
												styles.positionInput,
												styles.hiddenInput,
												{
													[styles.error]: errors?.position,
												},
											)}
											id={`${position.id}`}
											name='position'
											type='radio'
											value={position.id}
										/>
										<label htmlFor={`${position.id}`}>{position.name}</label>
									</div>
								))}
							</div>
							{errors?.position && (
								<div className={styles.errorText}>
									{errors.position.message}
								</div>
							)}
						</div>

						<div className={styles.inputContainer}>
							<Controller
								control={control}
								name='photo'
								rules={{
									required: 'Photo is required field',
									validate: {
										maxSize: value =>
											!value ||
											(value && value[0]?.size <= 5 * 1024 * 1024) ||
											'File size is too large',
										size: async value => {
											const minImageSize = 70;
											const image = new Image();

											const loadImage = new Promise(resolve => {
												image.onload = resolve;
											});

											image.src = URL.createObjectURL(value[0]);
											await loadImage;

											return (
												(image.width >= minImageSize &&
													image.height >= minImageSize) ||
												'Minimum size of photo 70x70px'
											);
										},
									},
								}}
								render={({
									field: { value, onChange },
									fieldState: { error },
								}) => (
									<>
										<input
											className={styles.hiddenInput}
											id='photo'
											name='photo'
											type='file'
											accept='.jpeg, .jpg'
											onChange={e => onChange(e.target.files)}
										/>
										<label className={styles.photoContainer} htmlFor='photo'>
											<div
												className={classNames(styles.photoButton, {
													[styles.error]: error,
												})}
											>
												Upload
											</div>
											<div
												className={classNames(styles.photoItem, {
													[styles.error]: error,
													[styles.photoItemError]: error,
													[styles.photoItemFilled]: value?.length,
												})}
											>
												{value?.length ? value[0].name : 'Upload your photo'}
											</div>
										</label>
										{error && (
											<div className={styles.errorText}>{error.message}</div>
										)}
									</>
								)}
							/>
						</div>
						<Button children={'Send'} type='submit' />
					</form>
				</>
			)}

			{isSent && !isError && (
				<div className={styles.image}>
					<h2 className={styles.title}>User successfully registered</h2>
					<SuccessImage />
				</div>
			)}

			{isError && <ErrorMessage />}
		</div>
	);
});
