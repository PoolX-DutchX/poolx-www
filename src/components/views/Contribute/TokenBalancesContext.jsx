import React, { useState } from 'react';

const TokenBalancesContext = React.createContext([{}, () => {}]);

const TokenBalancesProvider = props => {
  const [state, setState] = useState(null);
  return (
    <TokenBalancesContext.Provider value={[state, setState]}>
      {props.children}
    </TokenBalancesContext.Provider>
  );
};

export { TokenBalancesContext, TokenBalancesProvider };
