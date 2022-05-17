import { UserActions } from '../constants/action-types';
import AppDispatcher from '../stores/app-dispatcher';
import * as ActionType from './action-types';

export default class UserActionCreator {
  public static createFile(
    id: string,
    filename: string,
    parentId: string,
  ): void {
    const type = UserActions.createFile;
    const params: ActionType.CreateFileParams = { id, filename, parentId };
    this._dispatch(type, params);
  }

  public static createFolder(
    id: string,
    foldername: string,
    parentId: string,
  ): void {
    const type = UserActions.createFolder;
    const params: ActionType.CreateFolderParams = { id, foldername, parentId };
    this._dispatch(type, params);
  }

  public static deleteFile(id: string, parentId: string): void {
    const type = UserActions.deleteFile;
    const params: ActionType.DeleteFileParams = { id, parentId };
    this._dispatch(type, params);
  }

  public static deleteFolder(id: string, parentId: string): void {
    const type = UserActions.deleteFolder;
    const params: ActionType.DeleteFolderParams = { id, parentId };
    this._dispatch(type, params);
  }

  public static renameFile(id: string, newFilename: string): void {
    const type = UserActions.renameFile;
    const params: ActionType.RenameFileParams = { id, newFilename };
    this._dispatch(type, params);
  }

  public static renameFolder(id: string, newFoldername: string): void {
    const type = UserActions.renameFolder;
    const params: ActionType.RenameFolderParams = { id, newFoldername };
    this._dispatch(type, params);
  }

  public static openFile(id: string): void {
    const type = UserActions.openFile;
    const params: ActionType.OpenFileParams = { id };
    this._dispatch(type, params);
  }

  public static closeFile(id: string): void {
    const type = UserActions.closeFile;
    const params: ActionType.CloseFileParams = { id };
    this._dispatch(type, params);
  }

  public static createFileFromMenu(): void {
    const type = UserActions.createFileTopbar;
    this._dispatch(type, null);
  }

  public static createFolderFromMenu(): void {
    const type = UserActions.createFolderTopbar;
    this._dispatch(type, null);
  }

  public static deleteFromMenu(): void {
    const type = UserActions.deleteNodeTopbar;
    this._dispatch(type, null);
  }

  public static renameFromMenu(): void {
    const type = UserActions.renameNodeTopbar;
    this._dispatch(type, null);
  }

  private static _dispatch(type: string, params: unknown) {
    AppDispatcher.dispatch({
      type,
      params,
    });
  }
}
