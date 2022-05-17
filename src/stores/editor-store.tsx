import {
  ModelService,
  RealTimeModel,
  RealTimeString,
} from '@convergence/convergence';

import BaseStore from './base-store';
import { UserActions } from '../constants/action-types';
import {
  Action,
  // CloseFileParams,
  OpenFileParams,
} from '../actions/action-types';

export default class EditorStore extends BaseStore {
  private _rtModel: RealTimeModel;

  private _rtContent: RealTimeString;

  constructor(modelService: ModelService) {
    super(modelService);
    this._rtContent = null;
    this._rtModel = null;

    this._initModel = this._initModel.bind(this);
  }

  public getModel(): RealTimeModel {
    return this._rtModel;
  }

  public getContent(): RealTimeString {
    return this._rtContent;
  }

  public isFileOpened(): boolean {
    return this._rtModel !== null && this._rtModel.isOpen();
  }

  public dispose(): void {
    super.dispose();
    if (this._rtModel !== null && this._rtModel.isOpen()) {
      this._closeFile();
    }
  }

  protected _actionHandler(payload: unknown): void {
    const action = payload as Action;

    switch (action.type) {
      case UserActions.openFile:
        {
          const params = action.params as OpenFileParams;
          this._openFile(params.id);
        }
        break;
      case UserActions.closeFile:
        this._closeFile();
        break;
    }
  }

  private _openFile(id: string) {
    if (this._rtModel !== null && this._rtModel.isOpen()) {
      this._closeFile();
    }

    this._modelService
      .open(id)
      .then(this._initModel)
      .catch(error => {
        console.log(`Could not open file: ${id} ${error}`);
      });
  }

  private _initModel(model: RealTimeModel): void {
    this._rtModel = model;

    this._rtContent = model.elementAt('content') as RealTimeString;

    this._emitChange();
  }

  private _closeFile() {
    this._rtModel.close();
  }
}
