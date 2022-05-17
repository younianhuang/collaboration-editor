import Node from '../stores/node';
import * as actionTypes from './action-types';

type NodeActon = {
  type: string;
  param: unknown;
};

export type NodeState = {
  eventType: actionTypes.EventType;
  rootNode: Node;
  focusNodeID: string;
};

const initialState: NodeState = {
  eventType: actionTypes.EventType.None,
  rootNode: null,
  focusNodeID: '',
};

export default function reduceNode(
  state: NodeState = initialState,
  action: NodeActon,
): NodeState {
  switch (action.type) {
    case actionTypes.UPDATE_TREE:
      return {
        ...state,
        rootNode: action.param as Node,
      };
    case actionTypes.CALL_EVENT:
      return {
        ...state,
        eventType: (action.param as actionTypes.EventAction).eventType,
      };
    case actionTypes.FOCUS_NODE:
      return {
        ...state,
        focusNodeID: action.param as string,
      };
    default:
      return state;
  }
}
