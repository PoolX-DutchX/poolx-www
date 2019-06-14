import React, { toast } from 'react'
import { getEtherscanTxLink } from '../../../../constants'
import config from '../../../../configuration'
const { numberOfConfirmations } = config

export const showToastOnTxSubmitted = (txHash, poolStatus) =>
  toast.info(
    <p>
      Your MetaMask transaction submitted for pool {poolStatus}! <br />
      <a
        href={getEtherscanTxLink(txHash)}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on etherscan
      </a>
    </p>,
    {
      autoClose: false,
    }
  )

export const showToastOnTxConfirmation = (
  confirmationNumber,
  receipt,
  poolStatus
) => {
  if (confirmationNumber === numberOfConfirmations) {
    toast.success(
      <p>
        Your transaction has been mined for pool {poolStatus}! <br />
        <a
          href={getEtherscanTxLink(receipt.transactionHash)}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on etherscan
        </a>
      </p>,
      {
        autoClose: false,
      }
    )
  }
}

export const showToastOnTxError = (receipt, poolStatus) =>
  toast.error(
    <p>
      Oops something went wrong for pool {poolStatus}!
      <br />
      {receipt && (
        <span>
          <a
            href={getEtherscanTxLink(receipt.transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View transaction on etherscan
          </a>
          <br />
          and try again.
        </span>
      )}
    </p>
  )
