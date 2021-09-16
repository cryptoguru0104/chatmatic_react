import { createActions } from 'redux-actions';

const { setSearchString } = createActions({
    SET_SEARCH_STRING: searchStr => ({ searchStr })
});

export { setSearchString };
