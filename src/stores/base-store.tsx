import { ModelService } from '@convergence/convergence';
import { EventEmitter } from 'events';
import AppDispatcher from './app-dispatcher';

export const CHANGE_EVENT = 'CHANGE_EVENT';

export default abstract class BaseStore extends EventEmitter {
  protected _modelService: ModelService;

  private _dispatchToken: string;

  constructor(modelService: ModelService) {
    super();
    this._modelService = modelService;
    this._dispatchToken = AppDispatcher.register(
      this._actionHandler.bind(this),
    );
  }

  public addChangeListener(callback: () => void): void {
    this.on(CHANGE_EVENT, callback);
  }

  public removeChangeListener(callback: () => void): void {
    this.removeListener(CHANGE_EVENT, callback);
  }

  public dispose(): void {
    AppDispatcher.unregister(this._dispatchToken);
  }

  protected _emitChange(): void {
    this.emit(CHANGE_EVENT);
  }

  protected abstract _actionHandler(payload: unknown): void;
}
