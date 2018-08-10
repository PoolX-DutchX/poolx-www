import * as Yup from 'yup';
import Pool from '../../../../models/Pool';
import { checkEthereumAddress } from '../../../../lib/validators';

Yup.addMethod(Yup.string, 'ethereumAddress', checkEthereumAddress);

const stepOneSchema = Yup.object().shape({
  payoutAddress: Yup.string()
    .ethereumAddress('Invalid ethereum address')
    .required('Required'),
  payoutTxData: Yup.string()
});

export default [stepOneSchema];
