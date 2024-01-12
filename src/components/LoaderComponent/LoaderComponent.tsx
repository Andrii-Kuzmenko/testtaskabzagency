import React from 'react';
import { Loader } from '../icons/Loader';
import styles from './LoaderComponent.module.scss';

export const LoaderComponent = React.memo(() => (
  <Loader className={ styles.loader} />
));
