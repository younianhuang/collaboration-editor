import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import EditorWrapper from './components/editor-wrapper';
import Store from './ruducers/store-base';

function App(): JSX.Element {
  return (
    <div>
      <EditorWrapper />
    </div>
  );
}

ReactDOM.render(
  <Provider store={Store}>
    <App />,
  </Provider>,
  document.getElementById('root'),
);

export default App;
