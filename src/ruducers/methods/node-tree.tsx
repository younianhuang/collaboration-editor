import Store from '../store-base';
import Node from '../../stores/node';
import Standardizer from '../../library/standardizer';

export default class NodeTreeStore {
  public static getTree(): Node {
    return Store.getState().rootNode;
  }

  public static getFocusNodeID(): string {
    return Store.getState().focusNodeID;
  }

  public static findNode(id: string): Node {
    return this._getNode(this.getTree(), id);
  }

  private static _getNode(node: Node, id: string): Node {
    if (node === null) {
      return null;
    }

    if (node.id === id) {
      return node;
    }

    if (node.children === null || node.children === undefined) {
      return null;
    }

    let currentNode: Node = null;
    for (let i = 0; i < node.children.length; i += 1) {
      currentNode = this._getNode(node.children[i], id);
      if (currentNode !== null) {
        return currentNode;
      }
    }

    return null;
  }

  public static getNodeName(id: string): string {
    const node: Node = this.findNode(id);

    if (node === null) {
      return undefined;
    }

    return node.name;
  }

  public static getParentID(id: string): string {
    const node = this.findNode(id);

    if (node === null) {
      return undefined;
    }

    if (node.id === 'root') {
      return 'root';
    }

    return node.parentId;
  }

  public static isFileNameLegitimateForGUID(
    newName: string,
    id: string,
    parentID: string,
  ): string {
    const errorStr = Standardizer.isNodeNamelegitimate(newName);
    if (errorStr !== '') {
      return errorStr;
    }

    const parentNode = this.findNode(parentID);

    if (parentNode === null) {
      return 'Unknown error!';
    }

    if (parentNode.children === null || parentNode.children === undefined) {
      return '';
    }

    for (let index = 0; index < parentNode.children.length; index += 1) {
      if (
        id !== parentNode.children[index].id &&
        parentNode.children[index].name === newName
      ) {
        return 'This node name already exists!';
      }
    }

    return '';
  }

  public static getDefaultNewFolderName(parentID: string): string {
    const defaultName = 'NewFolder';

    let finalName = defaultName;
    let serial = 1;

    let count = 10000;
    while (count > 0) {
      count -= 1;
      const errorStr = NodeTreeStore.isFileNameLegitimateForGUID(
        finalName,
        '',
        parentID,
      );

      if (errorStr === '') {
        break;
      }

      finalName = defaultName + serial.toString();
      serial += 1;
    }

    return finalName;
  }

  public static getDefaultNewFileName(parentID: string): string {
    const defaultName = 'NewScript';

    let finalName = defaultName;
    let serial = 1;

    let count = 10000;
    while (count > 0) {
      count -= 1;
      const errorStr = NodeTreeStore.isFileNameLegitimateForGUID(
        finalName,
        '',
        parentID,
      );

      if (errorStr === '') {
        break;
      }

      finalName = defaultName + serial.toString();
      serial += 1;
    }

    return finalName;
  }
}
