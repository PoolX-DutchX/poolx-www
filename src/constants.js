export const AWAITING_CONTRIBUTION_TX = 'awaiting_contribution_tx';
export const CONTRIBUTION_TX_PENDING = 'contribution_tx_pending';
export const CONTRIBUTION_COMPLETE = 'contribution_complete';
export const AWAITING_CLAIM_TX = 'awaiting_claim_tx';
export const CLAIM_TX_PENDING = 'claim_tx_pending';
export const CLAIM_COMPLETE = 'claim_complete';

export const STATUS_OPEN = 'open';
export const STATUS_CLOSED = 'closed';

export const contributionStatusMap =  {
  [AWAITING_CONTRIBUTION_TX]: {
    displayText: 'Open',
    actionText: 'Send Funds',
    action: () => {}
  },
  [CONTRIBUTION_TX_PENDING]: {
    displayText: 'Closed',
    actionText: '',
    action: null
  },
  [CONTRIBUTION_COMPLETE]: {
    displayText: 'Open',
    actionText: 'Send Funds',
    action: () => {}
  },
  [AWAITING_CLAIM_TX]: {
    displayText: 'Closed',
    actionText: '',
    action: null
  },
  [CLAIM_TX_PENDING]: {
    displayText: 'Open',
    actionText: 'Send Funds',
    action: () => {}
  },
  [CLAIM_COMPLETE]: {
    displayText: 'Closed',
    actionText: '',
    action: null
  },
};

export const poolStatusMap =  {
  [STATUS_OPEN]: {
    displayText: 'Open',
    actionText: 'Send Funds',
    action: () => {}
  },
  [STATUS_CLOSED]: {
    displayText: 'Closed',
    actionText: '',
    action: null
  }
};
