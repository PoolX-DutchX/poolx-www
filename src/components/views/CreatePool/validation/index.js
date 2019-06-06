import * as Yup from 'yup'
import { ethereumAddress } from '../../../../lib/validators'

const stepOneSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  token1: ethereumAddress().required('Required'),
  // token2: ethereumAddress().required('Required'), // need to skip validation when it is wrapped ether
})

const stepTwoSchema = Yup.object().shape({
  initialClosingPrice: Yup.number()
    .min(0, `Must be more than zero`)
    .max(1e26, `Must be less than 1e+26`)
    .required('Required'),
})

export default [stepOneSchema, stepTwoSchema]
