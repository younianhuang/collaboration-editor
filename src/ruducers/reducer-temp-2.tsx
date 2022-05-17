import * as actionTypes from './action-types';

export type TempState = {
  count: number;
};

type TempAction = {
  type: string;
  param: number;
};

const initialState: TempState = {
  count: 100,
};

const reducer2 = (
  state: TempState = initialState,
  action: TempAction,
): TempState => {
  switch (action.type) {
    // case actionTypes.ADD_ARTICLE:
    //   // eslint-disable-next-line no-param-reassign
    //   state.count = action.param;
    //   return state;
    // case actionTypes.REMOVE_ARTICLE:
    //   return state;
    default:
      return state;
  }
  return state;
};

export default reducer2;
