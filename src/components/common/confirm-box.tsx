import React from 'react';

type ConfirmOpt = {
  name: string;
  onClickOption: () => void;
};

type StateProps = {
  title: string;
  opts: ConfirmOpt[];
  defaultOptIndex?: number;
};

export default class ConfirmBox extends React.Component<StateProps> {
  constructor(props: StateProps) {
    super(props);
    this._onClickMouseLeft = this._onClickMouseLeft.bind(this);
  }

  componentDidMount(): void {
    // 加入左鍵點擊操作監聽。
    document.addEventListener('click', this._onClickMouseLeft);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this._onClickMouseLeft);
  }

  private _onClickMouseLeft(event: MouseEvent): void {
    const element: HTMLDivElement = event.target as HTMLDivElement;
    let isFound = false;
    for (let i = 0; i < this.props.opts.length; i += 1) {
      if (this.props.opts[i].name === element.id) {
        isFound = true;
        this.props.opts[i].onClickOption();
        break;
      }
    }
    if (!isFound) {
      let index: number = this.props.defaultOptIndex;
      if (index === undefined) {
        index = 0;
      }
      this.props.opts[index].onClickOption();
    }
  }

  render(): React.ReactElement {
    return (
      <div>
        <div className="bg-gray-700 bg-opacity-50 absolute align-middle w-screen h-screen z-50 top-0 left-0" />
        <div className="bg-gray-500 absolute w-80 h-auto top-1/2 left-1/2 -ml-40 z-50 text-gray-200">
          <div className="bg-gray-800 w-100vw font-bold text-center text-2xl p-1">
            {this.props.title}
          </div>
          {this.props.opts.map(arr => {
            return (
              <div
                className="p-1 text-l cursor-pointer hover:bg-gray-600 text-white"
                aria-disabled={false}
                id={arr.name}
                key={arr.name}
              >
                {arr.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
