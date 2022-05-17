import React from 'react';
import { ModelService } from '@convergence/convergence';
import ConfirmBox from 'components/common/confirm-box';
import RenameBox from 'components/common/rename-box';
import { connect } from 'react-redux';
import Watch from 'redux-watch';
import Node, { NodeType } from '../../stores/node';
import Guid from '../../library/guid';
import SideBarContexMenu from './sidebar-contextmenu';
import UserActionCreator from '../../actions/user-action-creator';
import NewUserActionCreator from '../../ruducers/user-action-creator';
import Store from '../../ruducers/store-base';
import * as actionTypes from '../../ruducers/action-types';
import { NodeState } from '../../ruducers/reducer-node';
import NodeTreeStore from '../../ruducers/methods/node-tree';

const SPACING = 30;
const ARROW_SIZE = 20;
const DEFINE_ROOT_ID = 'root';

export enum AddingType {
  None = -1,
  Folder,
  File,
}

// The option structure of the menu that pops up when you right-click.
type ContextMenuOpt = {
  name: string;
  isEnabled: boolean;
};

// The option structure of the confirmation box that pops up when deleting files.
type ConfirmBoxOpt = {
  name: string;
  onClickOption: () => void;
};

type PropsParam = {
  modelService: ModelService;
  rootNode: Node;
};

type StateParam = {
  isShowContextMenu: boolean;
  x: number;
  y: number;
  isShowConfirm: boolean;
  isShowRename: boolean;
};

class SideBarTree extends React.Component<PropsParam, StateParam> {
  private _cmOpts: Array<ContextMenuOpt>;

  private _cfOpts: Array<ConfirmBoxOpt>;

  private _addType: AddingType;

  // The number of the file currently being operated
  private _operatingFileID: string;

  private _parentIDForAdding: string;

  // The default name to be displayed when adding or modifying the name of a file.
  private _defaultName: string;

  // The number of the script currently being edited.
  private _focusNodeID;

  private _isRenaming: boolean;

  private _expansion = new Map<string, boolean>();

  constructor(props: PropsParam) {
    // ️⚡️ does not compile in strict mode
    super(props);
    this._addType = AddingType.None;
    this._operatingFileID = '';
    this._focusNodeID = '';
    this._onClickContextMenu = this._onClickContextMenu.bind(this);
    this._onClickMouseRight = this._onClickMouseRight.bind(this);
    this._onClickMouseLeft = this._onClickMouseLeft.bind(this);
    this._onClickDeletingFileYes = this._onClickDeletingFileYes.bind(this);
    this._onClickDeletingFileNo = this._onClickDeletingFileNo.bind(this);
    this._onDecideName = this._onDecideName.bind(this);
    this._cfOpts = [
      { name: 'No', onClickOption: this._onClickDeletingFileNo },
      { name: 'Yes', onClickOption: this._onClickDeletingFileYes },
    ];
    this.state = {
      isShowContextMenu: false,
      x: 0,
      y: 0,
      isShowConfirm: false,
      isShowRename: false,
    };
    const w = Watch(Store.getState, 'eventType');
    Store.subscribe(w(this._onStoreEventCalled.bind(this)));
  }

  componentDidMount(): void {
    document.addEventListener('contextmenu', this._onClickMouseRight);
    document.addEventListener('click', this._onClickMouseLeft);
  }

  componentWillUnmount(): void {
    document.removeEventListener('contextmenu', this._onClickMouseRight);
    document.removeEventListener('click', this._onClickMouseLeft);
  }

  private _onStoreEventCalled(
    newVal: actionTypes.EventType,
    oldVal: actionTypes.EventType,
    objectPath: any,
  ) {
    switch (newVal) {
      case actionTypes.EventType.AddNewFileFromTopbar:
        this._operatingFileID =
          this._focusNodeID === '' ? DEFINE_ROOT_ID : this._focusNodeID;
        this._parentIDForAdding = this._getParentIDForCreatingNode(
          this._operatingFileID,
        );
        this._callAddNewFile();
        NewUserActionCreator.resetEventType();
        break;
      case actionTypes.EventType.AddNewFolderFromTopbar:
        this._operatingFileID =
          this._focusNodeID === '' ? DEFINE_ROOT_ID : this._focusNodeID;
        this._parentIDForAdding = this._getParentIDForCreatingNode(
          this._operatingFileID,
        );
        this._callAddNewFolder();
        NewUserActionCreator.resetEventType();
        break;
      case actionTypes.EventType.RenameNodeFromTopBar:
        this._operatingFileID =
          this._focusNodeID === '' ? DEFINE_ROOT_ID : this._focusNodeID;
        this._parentIDForAdding = NodeTreeStore.getParentID(
          this._operatingFileID,
        );
        this._callRename();
        NewUserActionCreator.resetEventType();
        break;
      case actionTypes.EventType.DeleteNodeFromTopBar:
        this._operatingFileID =
          this._focusNodeID === '' ? DEFINE_ROOT_ID : this._focusNodeID;
        this._callDelete();
        NewUserActionCreator.resetEventType();
        break;
      default:
        break;
    }
  }

  private _getParentIDForCreatingNode(id: string): string {
    const node = NodeTreeStore.findNode(id);

    if (node === null) {
      return undefined;
    }

    if (node.type === NodeType.Folder) {
      return node.id;
    }

    return node.parentId;
  }

  private _getOptsForBlank(): Array<ContextMenuOpt> {
    const os: Array<ContextMenuOpt> = [
      { name: 'Add New Folder', isEnabled: true },
      { name: 'Add New File', isEnabled: true },
      { name: 'test1', isEnabled: false },
      { name: 'test2', isEnabled: true },
    ];
    return os;
  }

  private _getOptsForFolder(isRoot: boolean): Array<ContextMenuOpt> {
    const os: Array<ContextMenuOpt> = [
      { name: 'Add New Folder', isEnabled: true },
      { name: 'Add New File', isEnabled: true },
      { name: 'Rename', isEnabled: !isRoot },
      { name: 'Delete', isEnabled: !isRoot },
    ];
    return os;
  }

  private _getOptsForFile(): Array<ContextMenuOpt> {
    const os: Array<ContextMenuOpt> = [
      { name: 'Rename', isEnabled: true },
      { name: 'Delete', isEnabled: true },
    ];
    return os;
  }

  private _onClickDeletingFileYes(): void {
    const operatingNode = NodeTreeStore.findNode(this._operatingFileID);
    switch (operatingNode.type) {
      case NodeType.Folder:
        UserActionCreator.deleteFolder(
          this._operatingFileID,
          operatingNode.parentId,
        );
        break;
      case NodeType.File:
        UserActionCreator.deleteFile(
          this._operatingFileID,
          operatingNode.parentId,
        );
        break;

      default:
        break;
    }
    document.addEventListener('click', this._onClickMouseLeft);
    this._operatingFileID = '';
    this.setState({ isShowConfirm: false });
  }

  private _onClickDeletingFileNo(): void {
    document.addEventListener('click', this._onClickMouseLeft);
    this._operatingFileID = '';
    this.setState({ isShowConfirm: false });
  }

  private _onClickContextMenu(optionStr: string): void {
    // Close the menu first.
    this.setState({ isShowContextMenu: false, x: 0, y: 0 });
    document.addEventListener('click', this._onClickMouseLeft);
    this._parentIDForAdding =
      this._operatingFileID === '' ? DEFINE_ROOT_ID : this._operatingFileID;
    // When performing the operation of adding a file.
    if (optionStr === 'Add New Folder') {
      this._callAddNewFolder();
    } else if (optionStr === 'Add New File') {
      this._callAddNewFile();
    } else if (optionStr === 'Delete') {
      this._callDelete();
    } else if (optionStr === 'Rename') {
      this._callRename();
    } else {
      this._operatingFileID = '';
      this.setState({});
    }
  }

  private _callAddNewFolder() {
    this._defaultName = NodeTreeStore.getDefaultNewFolderName(
      this._parentIDForAdding,
    );
    this._addType = AddingType.Folder;
    this.setState({ isShowRename: true });
  }

  private _callAddNewFile() {
    this._defaultName = NodeTreeStore.getDefaultNewFileName(
      this._parentIDForAdding,
    );
    this._addType = AddingType.File;
    this.setState({ isShowRename: true });
  }

  private _callDelete() {
    if (this._operatingFileID === 'root') {
      return;
    }
    this.setState({ isShowConfirm: true });
    document.removeEventListener('click', this._onClickMouseLeft);
  }

  private _callRename() {
    this._defaultName = NodeTreeStore.getNodeName(this._operatingFileID);
    this._isRenaming = true;
    this.setState({});
    setTimeout(this._delayFocus.bind(this), 100);
  }

  private _onClickMouseRight(event: MouseEvent): void {
    const element: Element = event.target as Element;
    if (element.id === '%renaming_id') {
      return;
    }
    const { isShowRename } = this.state;

    if (isShowRename) {
      return;
    }

    this._isRenaming = false;
    this._operatingFileID = '';

    if (this._isInsideBarArea(element)) {
      this._operatingFileID = this._showCustomContext(event);
      // this._parentIDForAdding =
      //  this._operatingFileID === '' ? 'root' : this._operatingFileID;
      this.setState({});
    } else if (
      element.hasAttribute('custom-area') &&
      element.attributes.getNamedItem('custom-area').value === 'customContext'
    ) {
      event.preventDefault();
    } else {
      this.setState({ isShowContextMenu: false, x: 0, y: 0 });
    }
  }

  private _onClickMouseLeft(event: MouseEvent): void {
    const element: Element = event.target as Element;
    if (element.id === '%renaming_id') {
      return;
    }
    const { isShowRename } = this.state;

    if (!isShowRename) {
      this._isRenaming = false;
      this._operatingFileID = '';

      this.setState({ isShowContextMenu: false, x: 0, y: 0 });

      if (this._isInsideBarArea(element)) {
        if (
          element.attributes.getNamedItem('custom-group').value === 'treenode'
        ) {
          this._focusNodeID = element.id;
          if (element.attributes.getNamedItem('custom-type').value === 'file') {
            UserActionCreator.openFile(element.id);
          }
          this.setState({});
          NewUserActionCreator.focusNode(this._focusNodeID);
        }
      }
    }
  }

  private _isInsideBarArea(element: Element): boolean {
    if (!element.hasAttribute('custom-area')) {
      return false;
    }

    if (element.attributes.getNamedItem('custom-area').value !== 'treearea') {
      return false;
    }

    return true;
  }

  // Display the menu and return the file number clicked.
  private _showCustomContext(event: MouseEvent): string {
    const element: Element = event.target as Element;
    let scriptID = '';
    const nodeTypeStr = element.hasAttribute('custom-type')
      ? element.attributes.getNamedItem('custom-type').value
      : '';
    // Different options are distinguished according to whether you click on the script or not.
    switch (nodeTypeStr) {
      case 'file':
        this._cmOpts = this._getOptsForFile();
        scriptID = (element as HTMLDivElement).id;
        break;
      case 'folder':
        this._cmOpts = this._getOptsForFolder(
          (element as HTMLDivElement).id === DEFINE_ROOT_ID,
        );
        scriptID = (element as HTMLDivElement).id;
        break;
      default:
        this._cmOpts = this._getOptsForBlank();
        break;
    }
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    document.removeEventListener('click', this._onClickMouseLeft);
    this.setState({ isShowContextMenu: true, x: clickX, y: clickY });

    return scriptID;
  }

  private _renderTree(node: Node, depth: number): React.ReactElement {
    if (node === null) {
      return <div />;
    }
    const isKeepW = node.children === null || node.children.length === 0;
    const nodeStyle = {
      transform: `translate(${(
        (isKeepW ? ARROW_SIZE : 0) +
        SPACING * depth
      ).toString()}px, 0px)`,
    };
    const operatingStyle = {
      color: '#F0915A',
    };
    const arrowType = this._isFolderExpanded(node.id)
      ? 'flex-none bg-arrow-down bg-no-repeat bg-cover w-5 h-5 my-auto'
      : 'flex-none bg-arrow-right bg-no-repeat bg-cover w-5 h-5 my-auto';
    let nodeClassName = 'flex-grow bg-no-repeat bg-contain indent-sm h-7 p-1';
    let group = '';
    switch (node.type) {
      case NodeType.Folder:
        group = 'folder';
        break;
      case NodeType.File:
        group = 'file';
        break;
      default:
        break;
    }
    if (this._focusNodeID === node.id) {
      nodeClassName += ` bg-${group}-white bg-gray-700 text-white`;
    } else {
      nodeClassName += ` bg-${group}-black hover:bg-${group}-white hover:bg-gray-600 hover:text-white`;
    }

    return (
      <div key={`${node.id}1`}>
        <div className="flex" style={nodeStyle} key={`${node.id}2`}>
          {isKeepW ? null : (
            <button
              className={arrowType}
              key={`${node.id}3`}
              type="button"
              aria-label="arrow"
              onClick={() => {
                this._setFolderExpansion(
                  node.id,
                  !this._isFolderExpanded(node.id),
                );
              }}
            />
          )}
          {this._isRenaming && node.id === this._operatingFileID ? (
            <input
              className={`flex-grow bg-no-repeat bg-contain indent-sm h-7 p-1 outline-none bg-${group}-white bg-blue-700 text-yellow-500`}
              key={node.id}
              id="%renaming_id"
              defaultValue={node.name}
              type="text"
              // onInput={this._onInput}
              onKeyDown={this._onKeyDown.bind(this)}
              custom-area="treearea"
              custom-group="renaming"
            />
          ) : (
            <div
              className={nodeClassName}
              style={node.id === this._operatingFileID ? operatingStyle : null}
              key={node.id}
              id={node.id}
              custom-area="treearea"
              custom-group="treenode"
              custom-type={group}
            >
              {node.name}
            </div>
          )}
        </div>
        {node.children?.map((arr, index) => {
          return this._isFolderExpanded(node.id)
            ? this._renderTree(arr, depth + 1)
            : null;
        })}
      </div>
    );
  }

  private _delayFocus(): void {
    document.getElementById('%renaming_id').focus();
  }

  // private _onInput(): void {
  //   // document.getElementById('renameing').blur();
  // }

  private _onKeyDown(event: React.KeyboardEvent): void {
    if (!this._isRenaming) {
      return;
    }

    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      const newName = (
        document.getElementById('%renaming_id') as HTMLInputElement
      ).value;
      const errorStr = NodeTreeStore.isFileNameLegitimateForGUID(
        newName,
        this._operatingFileID,
        NodeTreeStore.findNode(this._operatingFileID).parentId,
      );
      if (errorStr === '') {
        switch (NodeTreeStore.findNode(this._operatingFileID).type) {
          case NodeType.Folder:
            UserActionCreator.renameFolder(this._operatingFileID, newName);
            break;
          case NodeType.File:
            UserActionCreator.renameFile(this._operatingFileID, newName);
            break;

          default:
            break;
        }
        this._isRenaming = false;
        this._operatingFileID = '';
        this.setState({});
      } else {
        window.alert(errorStr);
      }
    } else if (event.code === 'Escape') {
      this._isRenaming = false;
      this._operatingFileID = '';
      this.setState({});
    }
  }

  private _onDecideName(isSuccessful: boolean, result?: string) {
    if (this._addType !== AddingType.None) {
      if (isSuccessful) {
        const errorStr = NodeTreeStore.isFileNameLegitimateForGUID(
          result,
          '',
          this._parentIDForAdding,
        );
        if (errorStr === '') {
          const newID = Guid.create().toString();
          switch (this._addType) {
            case AddingType.Folder:
              UserActionCreator.createFolder(
                newID,
                result,
                this._parentIDForAdding,
              );
              break;
            case AddingType.File:
              UserActionCreator.createFile(
                newID,
                result,
                this._parentIDForAdding,
              );
              break;
            default:
              break;
          }
          this._setFolderExpansion(this._parentIDForAdding, true);
          this._addType = AddingType.None;

          this._operatingFileID = '';
          this._parentIDForAdding = '';
          this.setState({ isShowRename: false });
        } else {
          window.alert(errorStr);
        }
      }
      // Cancel the operation of adding a script.
      else {
        this._addType = AddingType.None;
        this._operatingFileID = '';
        this._parentIDForAdding = '';
        this.setState({ isShowRename: false });
      }
    }
  }

  private _isFolderExpanded(id: string): boolean {
    if (!this._expansion.has(id)) {
      this._setFolderExpansion(id, false);
    }

    return this._expansion.get(id);
  }

  private _setFolderExpansion(id: string, isExpanded: boolean) {
    if (!this._expansion.has(id)) {
      this._expansion.set(id, isExpanded);
    } else {
      this._expansion.set(id, isExpanded);
    }
  }

  render(): React.ReactElement {
    const { x } = this.state;
    const { y } = this.state;
    const { isShowContextMenu: isVisible } = this.state;
    const { isShowConfirm } = this.state;
    const { rootNode } = this.props;
    const { isShowRename } = this.state;
    return (
      <div>
        {this._renderTree(rootNode, 0)}

        <div>
          {isVisible ? (
            <div>
              <SideBarContexMenu
                posx={x}
                posy={y}
                opsions={this._cmOpts}
                onClickMenu={this._onClickContextMenu}
              />
            </div>
          ) : null}

          {isShowConfirm ? (
            <div>
              <ConfirmBox title="Delete Script?" opts={this._cfOpts} />
            </div>
          ) : null}
          {isShowRename ? (
            <div>
              <RenameBox
                defaultName={this._defaultName}
                onDecided={this._onDecideName}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: NodeState) => {
  return {
    rootNode: state.rootNode,
  };
};

export default connect(mapStateToProps)(SideBarTree);
