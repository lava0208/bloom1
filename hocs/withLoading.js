import React, { useContext, useEffect } from 'react';
import Router from 'next/router';
import LoadingContext from '../contexts/loadingContext';
import HashLoader from 'react-spinners/HashLoader';

const withLoading = (WrappedComponent) => {
  return (props) => {
    const { loading, setLoading } = useContext(LoadingContext);

    useEffect(() => {
      const handleStart = () => setLoading(true);
      const handleComplete = () => setLoading(false);

      Router.events.on('routeChangeStart', handleStart);
      Router.events.on('routeChangeComplete', handleComplete);
      Router.events.on('routeChangeError', handleComplete);

      return () => {
        Router.events.off('routeChangeStart', handleStart);
        Router.events.off('routeChangeComplete', handleComplete);
        Router.events.off('routeChangeError', handleComplete);
      };
    }, []);

    return (
      <>
        {loading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <HashLoader color="#ffffff" size={100} />
          </div>
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withLoading;
