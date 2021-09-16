import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    flex: '1 1 0px',
    margin: theme.spacing(0.5),
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

const StyledToggleButton = withStyles((theme) => ({
  root: {
    backgroundColor: 'white  !important',
    fontSize:'14px',
    textTransform: 'capitalize !important'
  },
  selected: {
    backgroundColor: '#3350EE  !important',
    color: 'white !important'
  }
}))(ToggleButton)

export default function CustomizedDividers() {
  const [alignment, setAlignment] = React.useState('left');
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <div>
      <StyledToggleButtonGroup
          size="small"
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <StyledToggleButton value="left" aria-label="left aligned">
            <span>Send Replies to Specific Posts</span>
          </StyledToggleButton>
          <StyledToggleButton value="center" aria-label="centered">
            <span>Use Hashtag Genius</span>
          </StyledToggleButton>
        </StyledToggleButtonGroup>
       
    </div>
  );
}