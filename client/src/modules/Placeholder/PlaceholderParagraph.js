import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  ExLarge: {
    width: 1400,
  },
  large: {
    width: 1200,
  },
  medium: {
    width: 1000,
  },
  medium1: {
    width: 800,
  },
  medium2: {
    width: 600,
  },
  small1: {
    width: 400,
  },
  small2: {
    width: 200,
  },
});

function PlaceholderParagraph() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.ExLarge}>
        <Skeleton />
      </div>
      <div className={classes.large}>
        <Skeleton />
      </div>
      <div className={classes.medium}>
        <Skeleton />
      </div>
      <div className={classes.medium1}>
        <Skeleton />
      </div>
      <div className={classes.medium2}>
        <Skeleton />
      </div>
      <div className={classes.small1}>
        <Skeleton />
      </div>
      <div className={classes.small2}>
        <Skeleton />
      </div>
    </>
  );
}

export default PlaceholderParagraph;
