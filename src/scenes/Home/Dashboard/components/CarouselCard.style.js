import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  handler: {
    borderTop: "solid 1px #DCE0E9",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(1),
  },
  button: {
    color: '#15205B',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:focus' : {
      outline:'none'
    }
  },
  carousel: {
    '& .control-arrow': {
      display: 'none !important'
    }
  },
  carouselCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent:'space-between',
    height: '100%'
  }
  
}));
