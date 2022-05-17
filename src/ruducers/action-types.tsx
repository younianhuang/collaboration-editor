export const UPDATE_TREE = 'UPDATE_TREE';
export const FOCUS_NODE = 'FOCUS_NODE';
export const CALL_EVENT = 'CALL_EVENT';

export enum EventType {
  None,
  AddNewFolderFromTopbar,
  AddNewFileFromTopbar,
  RenameNodeFromTopBar,
  DeleteNodeFromTopBar,
}

export type EventAction = {
  eventType: EventType;
  param?: unknown;
};

export type CreateFileParams = {
  id: string;
  filename: string;
  parentId: string;
};

export type CreateFolderParams = {
  id: string;
  foldername: string;
  parentId: string;
};

export type DeleteFileParams = {
  id: string;
  parentId: string;
};

export type DeleteFolderParams = {
  id: string;
  parentId: string;
};

export type RenameFileParams = {
  id: string;
  newFilename: string;
};

export type RenameFolderParams = {
  id: string;
  newFoldername: string;
};

export type OpenFileParams = {
  id: string;
};

export type CloseFileParams = {
  id: string;
};
