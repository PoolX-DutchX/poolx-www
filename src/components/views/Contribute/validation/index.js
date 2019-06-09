import * as Yup from 'yup'

export default [
  Yup.object().shape({
    amount: Yup.number()
      .min(0.00001, 'Token amount too small!')
      .required('Required'),
  }),
]
