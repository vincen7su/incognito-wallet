import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { nodeSelector } from '@screens/Node/Node.selector';

const enhanceData = WrappedComp => props => {

  const {
    listDevice,
    noRewards,
    nodeRewards,
    isFetching,
    isRefreshing,
    isFetched,
    withdrawTxs,
    withdrawing
  } = useSelector(nodeSelector);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          listDevice,
          noRewards,
          nodeRewards,
          isFetching,
          isRefreshing,
          isFetched,
          withdrawTxs,
          withdrawing
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceData;