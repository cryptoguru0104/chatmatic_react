import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const CssPaper = withStyles({
    root: {
      padding: '30px 30px',
      borderRadius: '12px',
      height: props=>props.full?'100%':'auto',
      boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.02)'

    },
  })(Paper);

export default function MuiPaper({children, ...attributes}) {
  return (
    <CssPaper elevation={0} {...attributes}>
      {children}
    </CssPaper>
  );
}