import {
  ModelService,
  RealTimeElement,
  RealTimeModel,
  RealTimeObject,
  RealTimeArray,
  IConvergenceEvent,
} from '@convergence/convergence';

import BaseStore from './base-store';
import Node, { NodeType } from './node';

import {
  PROJECT_COLLECTION,
  FILE_COLLECTION,
} from '../constants/editor-configs';
import { UserActions } from '../constants/action-types';
import {
  Action,
  CreateFileParams,
  CreateFolderParams,
  DeleteFileParams,
  DeleteFolderParams,
  RenameFileParams,
  RenameFolderParams,
} from '../actions/action-types';
import UserActionCreator from '../actions/user-action-creator';

export default class ProjectStore extends BaseStore {
  private _rtModel: RealTimeModel;

  private _rtRootFolder: RealTimeArray;

  private _rtNodes: RealTimeObject;

  constructor(modelService: ModelService) {
    super(modelService);
    this._rtModel = null;
    this._handleRemoteChanges = this._handleRemoteChanges.bind(this);
  }

  public openAutoCreate(
    id: string,
    projectName: string,
    callback: (success: boolean) => void,
  ): void {
    console.log('Open project Model');

    this._modelService
      .openAutoCreate({
        collection: PROJECT_COLLECTION,
        id,
        data: {
          name: projectName,
          tree: {
            nodes: {
              root: {
                name: projectName,
                children: [],
              },
            },
          },
        },
      })
      .then((model: RealTimeModel) => {
        this._rtModel = model;
        this._rtRootFolder = this._getFolderModel('root');

        this._rtNodes = this._getNodesModel();

        this._rtNodes.events().subscribe(this._handleRemoteChanges);

        this._emitChange();

        callback(true);
      })
      .catch(error => {
        console.log(`Could not open project model: ${error}`);

        callback(false);
      });
  }

  public close(): void {
    if (this._rtModel !== null) {
      this._rtModel.close();
    }
  }

  public getTree(): Node {
    return this._createTreeNode('root', null);
  }

  private _createTreeNode(id: string, parentNode: Node): Node {
    const rtNode = this._getNodeModel(id);

    let node: Node;
    if (parentNode === null) {
      node = new Node(id, rtNode.get('name').value(), '');
    } else {
      node = new Node(id, rtNode.get('name').value(), parentNode.id);
      parentNode.children.push(node);
    }

    if (rtNode.hasKey('children')) {
      node.type = NodeType.Folder;
      node.children = new Array<Node>();
      const rtFolder = rtNode.get('children') as RealTimeArray;
      rtFolder.forEach((rtElement: RealTimeElement): void => {
        this._createTreeNode(rtElement.value(), node);
      });
    }

    return node;
  }

  private _getNodesModel(): RealTimeObject {
    return this._rtModel.elementAt(['tree', 'nodes']) as RealTimeObject;
  }

  private _getNodeModel(id: string): RealTimeObject {
    return this._rtModel.elementAt(['tree', 'nodes', id]) as RealTimeObject;
  }

  private _getFolderModel(id: string): RealTimeArray {
    return this._rtModel.elementAt([
      'tree',
      'nodes',
      id,
      'children',
    ]) as RealTimeArray;
  }

  protected _actionHandler(payload: unknown): void {
    const action = payload as Action;

    switch (action.type) {
      case UserActions.createFile:
        {
          const params = action.params as CreateFileParams;
          this._createFile(params.id, params.filename, params.parentId);
        }
        break;
      case UserActions.createFolder:
        {
          const params = action.params as CreateFolderParams;
          this._createFolder(params.id, params.foldername, params.parentId);
        }
        break;
      case UserActions.deleteFile:
        {
          const params = action.params as DeleteFileParams;
          this._deleteFile(params.id, params.parentId);
        }
        break;
      case UserActions.deleteFolder:
        {
          const params = action.params as DeleteFolderParams;
          this._deleteFolder(params.id, params.parentId);
        }
        break;
      case UserActions.renameFile:
        {
          const params = action.params as RenameFileParams;
          this._renameFile(params.id, params.newFilename);
        }
        break;
      case UserActions.renameFolder:
        {
          const params = action.params as RenameFolderParams;
          this._renameFolder(params.id, params.newFoldername);
        }
        break;
    }

    this._emitChange();
  }

  private _createFile(id: string, filename: string, parentId: string): void {
    if (this._rtNodes.hasKey(id)) {
      console.log(`Error! file ${id} already exist.`);
    } else {
      this._rtNodes.set(id, { name: filename, parentId });

      this._getFolderModel(parentId).push(id);

      this._createFileModel(id);
    }
  }

  private _createFolder(
    id: string,
    foldername: string,
    parentId: string,
  ): void {
    if (this._rtNodes.hasKey(id)) {
      console.log(`Error! folder ${id} already exist.`);
    } else {
      this._rtNodes.set(id, {
        name: foldername,
        parentId,
        children: [],
      });

      this._getFolderModel(parentId).push(id);
    }
  }

  private _deleteFile(id: string, parentId: string): void {
    /// remove node id form parent children array
    const parentFolder = this._getFolderModel(parentId);
    const index = parentFolder.findIndex(childId => childId.value() === id);
    if (index >= 0) {
      parentFolder.remove(index);
    } else {
      console.log(`Error! file ${id} does not exist`);
    }

    /// remove node
    this._rtNodes.remove(id);
    /// delete file model
    this._deleteFileModel(id);
  }

  private _deleteFolder(id: string, parentId: string): void {
    /// remove node id form parent children array
    const parentFolder = this._getFolderModel(parentId);
    const index = parentFolder.findIndex(childId => childId.value() === id);
    if (index >= 0) {
      parentFolder.remove(index);
    } else {
      console.log(`Error! file ${id} does not exist`);
    }

    /// delete this node and children node
    this._deleteNode(id, parentId);
  }

  private _deleteNode(id: string, parentId: string): void {
    const node = this._getNodeModel(id);

    /// folder node.
    /// delete all children nodes
    if (node.hasKey('children')) {
      const folder = this._getFolderModel(id);

      folder.forEach((element: RealTimeElement): void => {
        this._deleteNode(element.value(), id);
      });
    }
    /// file node delete file model
    else {
      this._deleteFileModel(id);
    }

    // remove this node
    this._rtNodes.remove(id);
  }

  private _renameFile(id: string, newFilename: string): void {
    const rtFile = this._getNodeModel(id);
    rtFile.set('name', newFilename);
  }

  private _renameFolder(id: string, newFoldername: string): void {
    const rtFile = this._getNodeModel(id);
    rtFile.set('name', newFoldername);
  }

  private _renameNode(id: string, newName: string): void {
    const rtFile = this._getNodeModel(id);
    rtFile.set('name', newName);
  }

  private _createFileModel(id: string) {
    this._modelService
      .create({
        collection: FILE_COLLECTION,
        id,
        data: {
          content: '',
        },
      })
      .then((fileId: string) => {
        UserActionCreator.openFile(fileId);
      });
  }

  private _deleteFileModel(id: string) {
    this._modelService.remove(id);
  }

  private _handleRemoteChanges(evt: IConvergenceEvent): void {
    this._emitChange();
  }
}
