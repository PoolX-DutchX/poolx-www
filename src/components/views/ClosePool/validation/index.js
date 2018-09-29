import * as Yup from 'yup';
import { ethereumAddress, hexString } from '../../../../lib/validators';

const stepOneSchema = Yup.object().shape({
  payoutAddress: ethereumAddress().required('Required'),
  payoutTxData: hexString(),
});

export default [stepOneSchema];
