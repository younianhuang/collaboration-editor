import React from 'react';
import { ModelService } from '@convergence/convergence';
import { connect } from 'react-redux';
import SideBarTree from './sidebar-tree';
import ProjectStore from '../../stores/project-store';
import { TempState } from '../../ruducers/reducer-temp-2';
import Store from '../../ruducers/store-base';
import * as actionTypes from '../../ruducers/action-types';

type SideBarAreaProps = {
  modelService: ModelService;
};

type SideBarAreaState = {
  projectName: string;
};

class SideBarArea extends React.Component<SideBarAreaProps, SideBarAreaState> {
  private _projectStore: ProjectStore;

  constructor(props: SideBarAreaProps) {
    super(props);
    this.state = {
      projectName: 'default-project',
    };

    this._projectStore = null;
  }

  componentDidMount(): void {
    if (this.props.modelService !== null) {
      this._openProjectModel(this.props.modelService, this.state.projectName);
    }
  }

  componentDidUpdate(
    prevProps: SideBarAreaProps,
    prevState: SideBarAreaState,
  ): void {
    if (prevProps.modelService === null && this.props.modelService !== null) {
      this._openProjectModel(this.props.modelService, this.state.projectName);
    }
  }

  componentWillUnmount(): void {
    if (this._projectStore !== null) {
      this._projectStore.close();
    }
  }

  private _openProjectModel(modelService: ModelService, projectName: string) {
    this._projectStore = new ProjectStore(modelService);

    this._projectStore.openAutoCreate(
      projectName,
      projectName,
      (success: boolean): void => {
        // console.log(this._projectStore.getTree());
        // if (this._sideBarTreeRef !== null) {
        //   this._sideBarTreeRef.current.syncNode(
        //     this._projectStore.getTreeState(),
        //   );
        // }
      },
    );

    this._projectStore.addChangeListener(this._onChange.bind(this));
  }

  private _onChange() {
    const action = {
      type: actionTypes.UPDATE_TREE,
      param: this._projectStore.getTree(),
    };
    Store.dispatch(action);
  }

  render(): React.ReactElement {
    return (
      <div className="w-1/5">
        <div className="bg-gray-800 w-full h-auto text-lg text-gray-300 text-center font-bold select-none">
          Files
        </div>
        <div
          // 若要製作拉sidebar寬度改變配置可直接調整w-1/5
          className="bg-gray-500 p-0 w-full h-full select-none overflow-auto"
          custom-area="treearea"
          custom-group="blank"
        >
          <SideBarTree modelService={this.props.modelService} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: TempState) => {
  return {
    value: state.count,
  };
};

// wrap App in connect and pass in mapStateToProps
export default connect(mapStateToProps)(SideBarArea);
