import { history } from './lib/helpers';
import PoolService from './services/Pool';

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
  }
};

export const poolStatusMap =  {
  [PENDING_DEPLOYMENT]: {
    displayText: 'Pending',
    actionText: 'View TX Data',
    action: (pool) => () => {
      history.push(`pools/${pool.id}/pendingTx`);
    }
  },
  [ACTIVE]: {
    displayText: 'Active',
    actionText: 'Send Funds',
    action: (pool) => () => {
      history.push(`pools/${pool.id}/payout`);
    }
  },
  [PENDING_CLOSE_POOL]: {
    displayText: 'Pending Send',
    actionText: 'View TX Data',
    action: (pool) => () => {
      history.push(`pools/${pool.id}/pendingTx`);
    }
  },
  [CLOSED]: {
    displayText: 'Funds Sent',
    actionText: 'Confirm Token',
    action: (pool) => () => {
      history.push(`pools/${pool.id}/confirmTokenBatch`);
    }
  },
  [PENDING_TOKEN_BATCH]: {
    displayText: 'Pending Token Confirmation',
    actionText: 'View TX Data',
    action: (pool) => () => {
      history.push(`pools/${pool.id}/pendingTx`);
    }
  },
  [PAYOUT_ENABLED]: {
    displayText: 'Token Confirmed',
    actionText: 'Add Token Batch',
    action: (pool) => () => {
      history.push(`pools/${pool.id}/confirmTokenBatch`);
    }
  },
  [PENDING_ENABLE_REFUNDS]: {
    displayText: 'Pending Enable Refunds',
    actionText: 'View TX Data',
    action: (pool) => () => {
      history.push(`pools/${pool.id}/pendingTx`);
    }
  },
  [REFUNDS_ENABLED]: {
    displayText: 'Refunds Enabled',
    actionText: '',
    action: null
  },
  [PAUSED]: {
    displayText: 'Paused',
    actionText: 'Unpause',
    action: null
  }
};


export const teamList = [
  {
    imgUrl: '/img/team/finn_schaedlich.jpg',
    name: 'Finn Schädlich',
    title: 'Co-founder'
  },
  {
    imgUrl: '/img/team/viktor_jamiolkowski.jpg',
    name: 'Viktor Jamiolkowski',
    title: 'Co-founder'
  },
  {
    imgUrl: '/img/team/gustavo_guimaraes.jpg',
    name: 'Gustavo Guimarães',
    title: 'Co-founder'
  },
  {
    imgUrl: '/img/team/michael_teixeira.jpg',
    name: 'Michael Teixeira',
    title: 'Co-founder'
  }
];
