import React from 'react';
import ErrorComponent from './ErrorComponent';

const App = () => {
  const hasError = true;
  const error = 'Failed to fetch data.';

  return (
    <div>
      {hasError ? <ErrorComponent errorMessage={error} /> : <p>Data loaded successfully.</p>}
    </div>
  );
};

export default App;
