import React from 'react';
import { Intent, Spinner } from '@blueprintjs/core';

const Loader = () => {
  return <Spinner size={32} intent={Intent.PRIMARY} />;
};

export default Loader;
