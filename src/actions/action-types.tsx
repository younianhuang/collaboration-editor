export type Action = {
  type: string;
  params: unknown;
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
