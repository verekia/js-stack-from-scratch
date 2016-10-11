// @flow

import { Map } from 'immutable';
import { MAKE_BARK } from '../actions/dog-actions';

const initialState = Map({
  hasBarked: false,
});

const dogReducer = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case MAKE_BARK:
      return state.set('hasBarked', action.payload);
    default:
      return state;
  }
};

export default dogReducer;
