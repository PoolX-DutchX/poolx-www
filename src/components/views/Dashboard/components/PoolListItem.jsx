import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { utils } from 'web3';
import { poolStatusMap } from '../../../../constants';

import Pool from '../../../../models/Pool';
import User from '../../../../models/User';

class PoolListItem extends React.Component {
  render() {
    const { pool, currentUser: { wallets } } = this.props;
    const userWalletAddresses = wallets.map(({ address })=> utils.toChecksumAddress(address));
    const isCreator = userWalletAddresses.includes(utils.toChecksumAddress(pool.ownerAddress));
    const poolAdminAddresses = pool.adminAddresses.map(adminAddress => utils.toChecksumAddress(adminAddress));
    let isAdmin;
    userWalletAddresses.forEach((wallet) => {
      isAdmin = poolAdminAddresses.includes(wallet);
    });
    console.log('isCreator', isCreator);
    console.log('isAdmin', isAdmin);
    const createdAt = new moment(pool.createdAt);
    const month = createdAt.format('MMM');
    const day = createdAt.format('DD');

    console.log('poolStatusMap', poolStatusMap);
    console.log('pool.status', pool.status);
    const {
      displayText: statusDisplayText,
      actionText: statusActionText,
      action: statusNextAction
    }  = poolStatusMap[pool.status];

    return (
      <div className="pool-list-item">
        { isAdmin ? <div className="role-badge admin">Admin</div> : isCreator && <div className="role-badge creator">Creator</div> }
        <div className="date">
          <div>{month}</div>
          <h4 className="day">{day}</h4>
        </div>
        <div className="pool-name">
          <h3>{pool.name}</h3>
        </div>
        <div className="net-invested">
          <span className="amount">{pool.netInvested}/{pool.cap}</span>&nbsp;<span className="denomination">ETH</span>
        </div>
        <div>
          {pool.contributionCount} Contributions
        </div>
        <div className="status">
          <h3>{statusDisplayText}</h3>
        </div>
        <div className="action-button">
          {
            !!statusNextAction && <Button variant="outlined" color="primary" onClick={statusNextAction}> {statusActionText} </Button>
          }
        </div>
      </div>
    );
  }
}

PoolListItem.propTypes = {
  pool: PropTypes.instanceOf(Pool),
  currentUser: PropTypes.instanceOf(User)
};

export default PoolListItem;
