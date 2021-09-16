import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const CssTypergraphy = withStyles({
    root: {
      color: props=>props.fontColor || '#15205B',
      fontSize: props=>props.fontSize || '15px',
      fontWeight: props => props.fontWeight || 'normal',
      lineHeight: '1.2em',
      overFlow: props => props.overFlow,
      textOverflow: props => props.textOverflow
    },
  })(Typography);

export default function MuiTypergraphy({children, ...attributes}) {
  return (
    <CssTypergraphy {...attributes}>
      {children}
    </CssTypergraphy>
  );
}