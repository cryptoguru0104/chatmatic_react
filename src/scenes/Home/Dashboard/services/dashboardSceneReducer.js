import { handleActions } from 'redux-actions';

import { setSearchString } from './dashboardSceneActions';

const defaultState = {
    searchStr: ''
};

const reducer = handleActions(
    {
        [setSearchString](state, { payload: { searchStr } }) {
            return {
                ...state,
                searchStr
            };
        }
    },
    defaultState
);

export default reducer;
