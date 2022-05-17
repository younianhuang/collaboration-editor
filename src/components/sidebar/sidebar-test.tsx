import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import watch from 'redux-watch';
import { NodeState } from '../../ruducers/reducer-node';
import Node from '../../stores/node';
import Store from '../../ruducers/store-base';

export const toggleMenu = (isActive: boolean) => ({
  isActive,
  type: 'TOGGLE_MENU',
});
interface IConnectedDispatch {
  toggleMenu: typeof toggleMenu;
}

type FieldPath = string | number | Array<string | number>;

export const ADD_TODO = 'ADD_TODO';
// eslint-disable-next-line @typescript-eslint/no-redeclare
// eslint-disable-next-line @typescript-eslint/naming-convention
export type ADD_TODO = typeof ADD_TODO;

export interface IAddTodoAction {
  text: string;
  type: ADD_TODO;
}

export const addTodo = (text: string): IAddTodoAction => ({
  text,
  type: ADD_TODO,
});

interface ISideBarTestProps {
  // value: number;
  rootNode: Node;
}

class SideBarTest extends React.Component<ISideBarTestProps> {
  constructor(props: ISideBarTestProps) {
    super(props);
    Store.subscribe(this._onTest.bind(this));
    const w = watch(Store.getState, 'rootNode');
    // store.subscribe(
    //   w((newVal, oldVal, objectPath) => {
    //     console.log(newVal);
    //     console.log(oldVal);
    //     console.log(
    //       'jjjjjjjjjjjjjjjjjjj : %s changed from %s to %s',
    //       objectPath,
    //       oldVal,
    //       newVal,
    //     );
    //     // admin.name changed from JP to JOE
    //   }),
    // );
    Store.subscribe(w(this._onChange.bind(this)));
  }

  private _onTest(): void {
    console.log('獲得state改變的事件');
  }

  private _onChange(newVal: Node, oldVal: Node, objectPath: FieldPath) {
    console.log(newVal);
    console.log(oldVal);
    console.log('test : %s changed from %s to %s', objectPath, oldVal, newVal);
  }

  render(): React.ReactElement {
    console.log('刷新狀態');
    // const { value } = this.props;
    return (
      <div className="w-1/5">
        <div className="bg-gray-800 w-full h-auto text-lg text-gray-300 text-center font-bold select-none">
          Files
        </div>
        <div>
          {/* <button style={{ width: 40, height: 40 }} onClick={onIncreaseClick}> */}
          <button type="button" aria-label="arrow">
            +
          </button>
          <div>{10}</div>
          {/* <button style={{ width: 40, height: 40 }} onClick={onReduceClick}> */}
          <button type="button" aria-label="arrow">
            -
          </button>
        </div>
        {/* <div
          className="bg-gray-500 p-0 w-full h-full select-none overflow-auto"
          custom-area="treearea"
          custom-group="blank"
        >
          <SideBarTree
            modelService={this.props.modelService}
            ref={this._sideBarTreeRef}
          />
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state: NodeState) => {
  return {
    // value: state.count,
    rootNode: state.rootNode,
  };
};

const mapDispatcherToProps = (
  dispatch: Dispatch,
): { addTodo: (text: string) => void } => ({
  addTodo: (text: string) => dispatch(addTodo(text)),
});

export default connect(mapStateToProps, mapDispatcherToProps)(SideBarTest);
