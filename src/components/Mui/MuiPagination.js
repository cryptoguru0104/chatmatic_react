import React, {useEffect} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';

const CssPagination = withStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    
  },
}))(Pagination);

const CssPaginationItem = withStyles((theme) => ({
  root: {
    backgroundColor: '#F8F9FC',
    color:'#898996'
  },
  selected: {
    backgroundColor: '#0A0D28 !important',
    color: 'white'
  }
}))(PaginationItem);

export default function PaginationSize(props) {
  return (
      <CssPagination count={10} size="large" {...props} renderItem={item => <CssPaginationItem {...item}/>}/>
  );
}