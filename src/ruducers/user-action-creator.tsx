// import { UserActions } from '../constants/action-types';
// import AppDispatcher from '../stores/app-dispatcher';
import * as ActionType from './action-types';
import Store from './store-base';

export default class UserActionCreator {
  // public static createFile(
  //     id: string,
  //     filename: string,
  //     parentId: string,
  // ): void {
  //     const type = UserActions.createFile;
  //     const params: ActionType.CreateFileParams = { id, filename, parentId };
  //     this._dispatch(type, params);
  // }

  // public static createFolder(
  //     id: string,
  //     foldername: string,
  //     parentId: string,
  // ): void {
  //     const type = UserActions.createFolder;
  //     const params: ActionType.CreateFolderParams = { id, foldername, parentId };
  //     this._dispatch(type, params);
  // }

  // public static deleteFile(id: string, parentId: string): void {
  //     const type = UserActions.deleteFile;
  //     const params: ActionType.DeleteFileParams = { id, parentId };
  //     this._dispatch(type, params);
  // }

  // public static deleteFolder(id: string, parentId: string): void {
  //     const type = UserActions.deleteFolder;
  //     const params: ActionType.DeleteFolderParams = { id, parentId };
  //     this._dispatch(type, params);
  // }

  // public static renameFile(id: string, newFilename: string): void {
  //     const type = UserActions.renameFile;
  //     const params: ActionType.RenameFileParams = { id, newFilename };
  //     this._dispatch(type, params);
  // }

  // public static renameFolder(id: string, newFoldername: string): void {
  //     const type = UserActions.renameFolder;
  //     const params: ActionType.RenameFolderParams = { id, newFoldername };
  //     this._dispatch(type, params);
  // }

  // public static openFile(id: string): void {
  //     const type = UserActions.openFile;
  //     const params: ActionType.OpenFileParams = { id };
  //     this._dispatch(type, params);
  // }

  // public static closeFile(id: string): void {
  //     const type = UserActions.closeFile;
  //     const params: ActionType.CloseFileParams = { id };
  //     this._dispatch(type, params);
  // }

  public static focusNode(id: string): void {
    const action = {
      type: ActionType.FOCUS_NODE,
      param: id,
    };
    Store.dispatch(action);
  }

  public static createFileFromMenu(): void {
    const eventParam: ActionType.EventAction = {
      eventType: ActionType.EventType.AddNewFileFromTopbar,
    };

    this._dispatchEvent(eventParam);
  }

  public static createFolderFromMenu(): void {
    const eventParam: ActionType.EventAction = {
      eventType: ActionType.EventType.AddNewFolderFromTopbar,
    };

    this._dispatchEvent(eventParam);
  }

  public static deleteFromMenu(): void {
    const eventParam: ActionType.EventAction = {
      eventType: ActionType.EventType.DeleteNodeFromTopBar,
    };

    this._dispatchEvent(eventParam);
  }

  public static renameFromMenu(): void {
    const eventParam: ActionType.EventAction = {
      eventType: ActionType.EventType.RenameNodeFromTopBar,
    };

    this._dispatchEvent(eventParam);
  }

  public static resetEventType(): void {
    const eventParam: ActionType.EventAction = {
      eventType: ActionType.EventType.None,
    };

    this._dispatchEvent(eventParam);
  }

  private static _dispatchEvent(eventParam: ActionType.EventAction) {
    const action = {
      type: ActionType.CALL_EVENT,
      param: eventParam,
    };
    Store.dispatch(action);
  }
}
