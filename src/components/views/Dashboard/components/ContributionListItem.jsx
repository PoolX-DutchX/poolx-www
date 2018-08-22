import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { contributionStatusMap } from '../../../../constants';

import Contribution from '../../../../models/Contribution';
import User from '../../../../models/User';

class ContributionListItem extends React.Component {
  constructor() {
    super();
    this.getTokenEntitlement = this.getTokenEntitlement.bind(this);
  }
  getTokenEntitlement() {
    console.log('here');
    const { contribution: { pool: { tokenBalance, netInvested: poolNetInvested }, amount: amountInvested}} = this.props;
    console.log('amountInvested', amountInvested);
    console.log('poolNetInvested', poolNetInvested);
    console.log('tokenBalance', tokenBalance);
    return (amountInvested / poolNetInvested) * tokenBalance;
  }
  render() {
    const { contribution } = this.props; //currentUser: { wallets }
    const createdAt = new moment(contribution.createdAt);
    const month = createdAt.format('MMM');
    const day = createdAt.format('DD');
    const pool = contribution.pool;

    const {
      displayText: statusDisplayText,
      actionText: statusActionText,
      action: statusNextAction
    }  = contributionStatusMap[contribution.status];

    return (
      <div className="pool-list-item">
        <div className="date">
          <div>{month}</div>
          <h4 className="day">{day}</h4>
        </div>
        <div className="pool-name">
          <h3>{pool.name}</h3>
        </div>
        <div className="contribution-amount">
          <h3>{contribution.amount} Eth</h3>
        </div>
        <div className="status">
          <h3>{statusDisplayText}</h3>
        </div>
        <div className="contribution-token-entitlement">
          {
            !!pool.tokenBalance && <h3>{this.getTokenEntitlement()} {pool.tokenName.toUpperCase()}</h3>
          }
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

ContributionListItem.propTypes = {
  contribution: PropTypes.instanceOf(Contribution),
  currentUser: PropTypes.instanceOf(User)
};

export default ContributionListItem;
