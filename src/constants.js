//Contribution Statuses
export const PENDING_CONFIRMATION = 'pending_confirmation';
export const CONFIRMED = 'confirmed';
export const TOKENS_AVAILABLE = 'tokens_available';
export const PENDING_CLAIM_TOKENS = 'pending_claim_tokens';
export const TOKENS_CLAIMED = 'tokens_claimed';

//Pool Statuses
export const PENDING_DEPLOYMENT = 'pending_deployment';
export const ACTIVE = 'active';
export const PENDING_CLOSE_POOL = 'pending_close_pool';
export const CLOSED = 'closed';
export const PENDING_TOKEN_BATCH = 'pending_token_batch';
export const PAYOUT_ENABLED = 'payout_enabled';
export const PENDING_ENABLE_REFUNDS = 'pending_enable_refunds';
export const REFUNDS_ENABLED = 'refunds_enabled';
export const PAUSED = 'paused';

export const contributionStatusMap =  {
  [PENDING_CONFIRMATION]: {
    displayText: 'Pending',
    actionText: 'View TX Data',
    action: () => {}
  },
  [CONFIRMED]: {
    displayText: 'Confirmed',
    actionText: 'Withdraw',
    action: null
  },
  [TOKENS_AVAILABLE]: {
    displayText: 'Tokens Available',
    actionText: 'Claim Token',
    action: () => {}
  },
  [PENDING_CLAIM_TOKENS]: {
    displayText: 'Pending Claim',
    actionText: 'View TX Data',
    action: () => {}
  },
  [TOKENS_CLAIMED]: {
    displayText: 'Tokens Claimed',
    actionText: '',
    action: null
  },
};

export const poolStatusMap =  {
  [PENDING_DEPLOYMENT]: {
    displayText: 'Pending',
    actionText: 'View TX Data',
    action: () => {}
  },
  [ACTIVE]: {
    displayText: 'Active',
    actionText: 'Send Funds',
    action: null
  },
  [PENDING_CLOSE_POOL]: {
    displayText: 'Pending Send',
    actionText: 'View TX Data',
    action: () => {}
  },
  [CLOSED]: {
    displayText: 'Funds Sent',
    actionText: 'Confirm Token',
    action: null
  },
  [PENDING_TOKEN_BATCH]: {
    displayText: 'Pending Token Confirmation',
    actionText: 'View TX Data',
    action: () => {}
  },
  [PAYOUT_ENABLED]: {
    displayText: 'Token Confirmed',
    actionText: 'Add Token Batch',
    action: () => {}
  },
  [PENDING_ENABLE_REFUNDS]: {
    displayText: 'Pending Enable Refunds',
    actionText: 'View TX Data',
    action: null
  },
  [REFUNDS_ENABLED]: {
    displayText: 'Refunds Enabled',
    actionText: '',
    action: () => {}
  },
  [PAUSED]: {
    displayText: 'Paused',
    actionText: 'Unpause',
    action: null
  }
};
