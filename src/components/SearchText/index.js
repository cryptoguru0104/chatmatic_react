import React from 'react'
import { Input, TextField } from '@material-ui/core'
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';
import './style.scss'

const CssTextField = withStyles({
  root: {
    height: '100%',
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'transparent',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent',
      },
      '& input': {
        boxSizing: 'border-box'
      },
      '&:hover fieldset': {
        borderColor: 'transparent',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'transparent',
      },
    },
  },
})(TextField);

export default function SearchText(props) {
    return (
        <div className="search-text">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.04606 0C3.16097 0 0 3.16097 0 7.04606C0 10.9314 3.16097 14.0921 7.04606 14.0921C10.9314 14.0921 14.0921 10.9314 14.0921 7.04606C14.0921 3.16097 10.9314 0 7.04606 0ZM7.04606 12.7913C3.87816 12.7913 1.30081 10.214 1.30081 7.04609C1.30081 3.87819 3.87816 1.30081 7.04606 1.30081C10.214 1.30081 12.7913 3.87816 12.7913 7.04606C12.7913 10.214 10.214 12.7913 7.04606 12.7913Z" fill="#898996"/>
              <path d="M15.808 14.8893L12.079 11.1603C11.8249 10.9062 11.4134 10.9062 11.1593 11.1603C10.9052 11.4142 10.9052 11.8261 11.1593 12.08L14.8883 15.809C15.0154 15.936 15.1817 15.9996 15.3482 15.9996C15.5145 15.9996 15.681 15.936 15.808 15.809C16.0621 15.5551 16.0621 15.1432 15.808 14.8893Z" fill="#898996"/>
            </svg>

            <CssTextField
              type="text"
              className="form-control rounded bg-white"
              variant="outlined"
              {...props}
            />
        </div>
    )
}