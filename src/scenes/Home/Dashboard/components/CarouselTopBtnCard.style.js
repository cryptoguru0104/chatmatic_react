import { CallReceived } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  carouselCard: {
    display: 'flex',
    direction: 'column',
  },
  handler: {
    display: "flex",
    justifyContent: "space-between",
  },
  h2: {
    flex: 1
  },
  button: {
    color: '#15205B',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    marginRight: '10px !important',
    '&:focus' : {
      outline:'none'
    }
  },
  roundbutton: {
    borderRadius: 10,
    outline: 'none',
    backgroundColor: '#FFF',
    width: '50%',
    border: '1px solid #DCE0E9',
    margin: 'auto',
    height: '33px'
  },
  carousel: {
      flex: 1,
      height:'100%',
    '& .control-arrow': {
      display: 'none !important',
    },
    marginBottom: 5
  },
  carouselCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContenbuttoncontainert:'space-between',
    height: '100%'
  },
  buttoncontainer: {
    display: 'flex'
  }
}));
