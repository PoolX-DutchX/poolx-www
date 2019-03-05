import { history } from './lib/helpers'
import config from './configuration'
import ContributionService from './services/Contribution'

//Contribution Statuses
export const PENDING_CONFIRMATION = 'pending_confirmation'
export const CONFIRMED = 'confirmed'
export const TOKENS_AVAILABLE = 'tokens_available'
export const PENDING_CLAIM_TOKENS = 'pending_claim_tokens'
export const TOKENS_CLAIMED = 'tokens_claimed'
export const REFUND_AVAILABLE = 'refund_available'
export const PENDING_REFUND = 'pending_refund'
export const REFUND_RECEIVED = 'refund_received'
// export const PAUSED = 'paused';

//Pool Statuses
export const PENDING_DEPLOYMENT = 'pending_deployment'
export const ACTIVE = 'active'
export const PENDING_CLOSE_POOL = 'pending_close_pool'
export const CLOSED = 'closed'
export const PENDING_TOKEN_BATCH = 'pending_token_batch'
export const PAYOUT_ENABLED = 'payout_enabled'
export const PENDING_ENABLE_REFUNDS = 'pending_enable_refunds'
export const REFUNDS_ENABLED = 'refunds_enabled'
export const PAUSED = 'paused'

export const statusDisplayMap = {
  //Contributions
  [PENDING_CONFIRMATION]: 'Pending Confirmation',
  [CONFIRMED]: 'Confirmed',
  [TOKENS_AVAILABLE]: 'Tokens Available',
  [PENDING_CLAIM_TOKENS]: 'Pending Claim',
  [TOKENS_CLAIMED]: 'Tokens Claimed',
  [REFUND_AVAILABLE]: 'Refund Available',
  [PENDING_REFUND]: 'Pending Refund',
  [REFUND_RECEIVED]: 'Refunded',
  //Pools
  [PENDING_DEPLOYMENT]: 'Pending Deploy',
  [ACTIVE]: 'Active',
  [PENDING_CLOSE_POOL]: 'Pending Send Funds',
  [CLOSED]: 'Funds Sent',
  [PENDING_TOKEN_BATCH]: 'Pending Add Token Batch',
  [PAYOUT_ENABLED]: 'Payout Enabled',
  [PENDING_ENABLE_REFUNDS]: 'Pending Enable Refunds',
  [REFUNDS_ENABLED]: 'Refunds Enabled',
  [PAUSED]: 'Paused',
}

export const contributionStatusMap = {
  [PENDING_CONFIRMATION]: {
    displayText: 'Pending',
    actionText: 'View TX Data',
    action: contribution => () => {
      history.push(`contributions/${contribution.id}/pendingTx`)
    },
  },
  [CONFIRMED]: {
    displayText: 'Confirmed',
    actionText: 'Withdraw',
    action: null,
  },
  [TOKENS_AVAILABLE]: {
    displayText: 'Tokens Available',
    actionText: 'Claim Token',
    action: ({ id: contributionId, poolAddress, ownerAddress }) => async () => {
      await ContributionService.patch(contributionId, {
        status: PENDING_CLAIM_TOKENS,
        poolAddress,
        ownerAddress,
      })
      history.push(`contributions/${contributionId}/pendingTx`)
    },
  },
  [PENDING_CLAIM_TOKENS]: {
    displayText: 'Pending Claim',
    actionText: 'View TX Data',
    action: contribution => () => {
      history.push(`contributions/${contribution.id}/pendingTx`)
    },
  },
  [TOKENS_CLAIMED]: {
    displayText: 'Tokens Claimed',
    actionText: '',
    action: null,
  },
  [REFUND_AVAILABLE]: {
    displayText: 'Refund enabled',
    actionText: '',
    action: null,
  },
  [PENDING_REFUND]: {
    displayText: 'Pending Refund',
    actionText: '',
    action: null,
  },
  [REFUND_RECEIVED]: {
    displayText: 'Refunded',
    actionText: '',
    action: null,
  },
}

export const poolStatusMap = {
  [PENDING_DEPLOYMENT]: {
    displayText: statusDisplayMap[PENDING_DEPLOYMENT],
    actionText: 'View TX Data',
    action: pool => () => {
      history.push(`pools/${pool.id}/pendingTx`)
    },
  },
  [ACTIVE]: {
    displayText: statusDisplayMap[ACTIVE],
    actionText: 'Send Funds',
    action: pool => () => {
      history.push(`pools/${pool.id}/payout`)
    },
  },
  [PENDING_CLOSE_POOL]: {
    displayText: statusDisplayMap[PENDING_CLOSE_POOL],
    actionText: 'View TX Data',
    action: pool => () => {
      history.push(`pools/${pool.id}/pendingTx`)
    },
  },
  [CLOSED]: {
    displayText: statusDisplayMap[CLOSED],
    actionText: 'Confirm Token',
    action: pool => () => {
      history.push(`pools/${pool.id}/confirmTokenBatch`)
    },
  },
  [PENDING_TOKEN_BATCH]: {
    displayText: statusDisplayMap[PENDING_TOKEN_BATCH],
    actionText: 'View TX Data',
    action: pool => () => {
      history.push(`pools/${pool.id}/pendingTx`)
    },
  },
  [PAYOUT_ENABLED]: {
    displayText: statusDisplayMap[PAYOUT_ENABLED],
    actionText: 'Add Token Batch',
    action: pool => () => {
      history.push(`pools/${pool.id}/confirmTokenBatch`) //token address needs to be disabled, without needing
    },
  },
  [PENDING_ENABLE_REFUNDS]: {
    displayText: statusDisplayMap[PENDING_ENABLE_REFUNDS],
    actionText: 'View TX Data',
    action: pool => () => {
      history.push(`pools/${pool.id}/pendingTx`)
    },
  },
  [REFUNDS_ENABLED]: {
    displayText: statusDisplayMap[REFUNDS_ENABLED],
    actionText: '',
    action: null,
  },
  [PAUSED]: {
    displayText: statusDisplayMap[PAUSED],
    actionText: 'Unpause',
    action: null,
  },
}

export const teamList = [
  {
    imgUrl: '/img/team/finn_schaedlich.jpg',
    name: 'Finn Schädlich',
    title: 'Co-founder',
  },
  {
    imgUrl: '/img/team/viktor_jamiolkowski.jpg',
    name: 'Viktor Jamiolkowski',
    title: 'Co-founder',
  },
  {
    imgUrl: '/img/team/gustavo_guimaraes.jpg',
    name: 'Gustavo Guimarães',
    title: 'Co-founder',
  },
  {
    imgUrl: '/img/team/michael_teixeira.jpg',
    name: 'Michael Teixeira',
    title: 'Co-founder',
  },
]

export const getEtherscanTxLink = txHash => {
  return `${config.etherscan}/tx/${txHash}`
}
