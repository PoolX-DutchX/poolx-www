import React, { toast } from 'react'
import { getEtherscanTxLink } from '../../../../constants'

export const showToastOnTxSubmitted = txHash =>
  toast.info(
    <p>
      Your MetaMask transaction submitted! <br />
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

export const showToastOnTxConfirmation = (confirmationNumber, receipt) => {
  if (confirmationNumber === 5) {
    toast.success(
      <p>
        Your transaction has been mined! <br />
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

export const showToastOnTxError = receipt =>
  toast.error(
    <p>
      Oops something went wrong! <br />
      {receipt && (
        <span>
          It Looks like you've ran out of gas,
          <a
            href={getEtherscanTxLink(receipt.transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            view on etherscan
          </a>
          and try again.
        </span>
      )}
    </p>
  )
