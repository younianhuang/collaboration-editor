import React from 'react';

type StateProps = {
  defaultName: string;
  onDecided: (isSuccessful: boolean, result?: string) => void;
};

export default class RenameBox extends React.Component<StateProps> {
  constructor(props: StateProps) {
    super(props);
    this._onClickMouseLeft = this._onClickMouseLeft.bind(this);
    this._onClickMouseRight = this._onClickMouseRight.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('click', this._onClickMouseLeft);
    document.addEventListener('contextmenu', this._onClickMouseRight);
    setTimeout(this._delayFocus.bind(this), 200);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this._onClickMouseLeft);
    document.removeEventListener('contextmenu', this._onClickMouseRight);
  }

  private _delayFocus(): void {
    document.getElementById('%renaming_id').focus();
  }

  private _onClickMouseLeft(event: MouseEvent): void {
    const element: HTMLDivElement = event.target as HTMLDivElement;
    if (element.hasAttribute('custom-area')) {
      if (
        element.attributes.getNamedItem('custom-area').value === 'renamebox'
      ) {
        return;
      }
    }

    this.props.onDecided(false);
  }

  private _onClickMouseRight(event: MouseEvent) {
    const element: HTMLDivElement = event.target as HTMLDivElement;
    if (element.hasAttribute('custom-area')) {
      if (
        element.attributes.getNamedItem('custom-area').value === 'renamebox'
      ) {
        event.preventDefault();
        return;
      }
    }

    event.preventDefault();
    this.props.onDecided(false);
  }

  private _onKeyDown(event: React.KeyboardEvent): void {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.props.onDecided(
        true,
        (document.getElementById('%renaming_id') as HTMLInputElement).value,
      );
    } else if (event.code === 'Escape') {
      this.props.onDecided(false);
    }
  }

  render(): React.ReactElement {
    return (
      <div>
        <div className="bg-gray-700 bg-opacity-50 absolute align-middle w-screen h-screen z-50 top-0 left-0" />
        <div
          className="bg-gray-500 absolute w-80 h-20 top-1/2 left-1/2 -ml-40 -mt-10  z-50"
          custom-area="renamebox"
        >
          <div className="p-1.5 text-xl ml-2" custom-area="renamebox">
            Enter filename:
          </div>
          <input
            className="bg-gray-900 border-0 w-72 ml-4 text-lg text-white"
            id="%renaming_id"
            defaultValue={this.props.defaultName}
            onKeyDown={this._onKeyDown.bind(this)}
            custom-area="renamebox"
          />
        </div>
      </div>
    );
  }
}
