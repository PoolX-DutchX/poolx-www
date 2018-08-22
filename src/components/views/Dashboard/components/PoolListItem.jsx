import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { utils } from 'web3';
import { poolStatusMap } from '../../../../constants';

import Pool from '../../../../models/Pool';
import User from '../../../../models/User';
import { isPoolCreator, isPoolAdmin } from '../../../../lib/helpers';

class PoolListItem extends React.Component {
  render() {
    const { pool, currentUser } = this.props;
    const isCreator = isPoolCreator(pool, currentUser);
    const isAdmin = isPoolAdmin(pool, currentUser);
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
        { isCreator ? <div className="role-badge creator">Creator</div> : isAdmin && <div className="role-badge admin">Admin</div> }
        <div className="date">
          <div>{month}</div>
          <h4 className="day">{day}</h4>
        </div>
        <Link to={`/pools/${pool.id}`}>
          <div className="pool-name">
            <h3>{pool.name}</h3>
          </div>
        </Link>
        <div className="net-invested">
          <span className="amount">{pool.netInvested || '0'}/{pool.maxAllocation}</span>&nbsp;<span className="denomination">ETH</span>
        </div>
        <div>
          {pool.contributionCount} Contributions
        </div>
        <div className="status">
          <h3>{statusDisplayText}</h3>
        </div>
        <div className="action-button">
          {
            !!statusNextAction && <Button variant="outlined" color="primary" onClick={statusNextAction(pool)}> {statusActionText} </Button>
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
