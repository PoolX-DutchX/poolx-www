import * as Yup from 'yup'
import Pool from '../../../../models/Pool'
import { ethereumAddress, hexString } from '../../../../lib/validators'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  ownerAddress: ethereumAddress().required('Required'),
  maxAllocation: Yup.number()
    .min(0, `Must be more than zero`)
    .required('Required'),
  minContribution: Yup.number()
    .when('maxAllocation', (maxAllocation, schema) => {
      return maxAllocation
        ? schema.max(maxAllocation, 'Must be less than Net max pool allocation')
        : schema
    })
    .min(0, `Must be more than zero`)
    .required('Required'),
  maxContribution: Yup.number()
    .when('maxAllocation', (maxAllocation, schema) => {
      return maxAllocation
        ? schema.max(maxAllocation, 'Must be less than Net max pool allocation')
        : schema
    })
    .min(0, `Must be more than zero`)
    .when('minContribution', (minContribution, schema) => {
      return minContribution
        ? schema.min(minContribution, 'Must be more than Minimum contribution')
        : schema
    })
    .required('Required'),
  fee: Yup.number()
    .min(0, `Must be more than zero`)
    .max(100, `Must be less than 100`)
    .required('Required'),
  feePayoutCurrency: Yup.string()
    .oneOf(
      [Pool.CURRENCY_ETHER, Pool.CURRENCY_TOKEN],
      `Must be either ${Pool.CURRENCY_ETHER} or ${Pool.CURRENCY_TOKEN}`
    )
    .required('Select a payout currency'),
  adminPayoutAddress: ethereumAddress().required('Required'),
  admins: Yup.array()
    .of(
      Yup.object().shape({
        address: ethereumAddress().required('Required'),
        name: Yup.string(),
      })
    )
    .max(5),
  lockPayoutAddress: Yup.boolean().required('Required'),
  payoutAddress: ethereumAddress(),
  payoutTxData: hexString(),
})

export default validationSchema
