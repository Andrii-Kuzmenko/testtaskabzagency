import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../Button';
import { FormDataType } from '../../types/FormDataType';
import { Position } from '../../types/Position';

import { getToken } from '../../api/token';
import { postUser } from '../../api/users';
import { getPositions } from '../../api/position';
import styles from './Form.module.scss';

type Props = {
	setPage: Dispatch<SetStateAction<number>>;
};

export const Form = React.memo<Props>(({ setPage }) => {
	const [positions, setPositions] = useState<Position[]>([]);

	const fetchToken = async () => {
		try {
			const fetchedToken = await getToken();

			return fetchedToken.token;
		} catch (error) {
			console.log(error);
		}
	};

	const fetchPositions = async () => {
		try {
			const fetchedPositions = await getPositions();

			setPositions(fetchedPositions.positions);
		} catch (error) {
			console.log(error);
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
		formData.append('phone', data.phone);
		formData.append('position_id', data.position);
		formData.append('photo', data.photo[0]);

		const accessToken = await fetchToken();

		if (!accessToken) {
			return;
		}

		const resp = await postUser(formData, accessToken);
		console.log('resp', resp);

		reset();
		setPage(1);
	};

	return (
		<div>
			<h2 className={styles.title}>Working with POST request</h2>
			<form className={styles.form} id='form' onSubmit={handleSubmit(onSubmit)}>
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
					<div className={styles.phone}>
						<input
							{...register('phone', {
								required: 'phone is required field',
								pattern: {
									value: /^(\+380\d{9})$/,
									message: 'Number should start with code of Ukraine +380',
								},
							})}
							className={classNames(styles.input, {
								[styles.error]: errors?.phone,
							})}
							name='phone'
							type='text'
							placeholder='Phone'
						/>
						<p className={styles.phoneHint}>+38 (XXX) XXX - XX - XX</p>
					</div>
					{errors?.phone && (
						<div className={styles.errorText}>{errors.phone.message}</div>
					)}
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
						<div className={styles.errorText}>{errors.position.message}</div>
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
						render={({ field: { value, onChange }, fieldState: { error } }) => (
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
		</div>
	);
});
