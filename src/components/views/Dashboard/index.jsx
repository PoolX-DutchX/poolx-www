import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';

import WalletList from './components/WalletList';
import InfoList from './components/InfoList';
import PoolList from './components/PoolList';
import ContributionList from './components/ContributionList';

import User from '../../../models/User';
import Loader from '../../Loader';
import { history } from '../../../lib/helpers';
import { isLoggedIn } from '../../../lib/middleware';

import PoolService from '../../../services/Pool';
import ContributionService from '../../../services/Contribution';

const CONTRIBUTOR_MODE = 'contributor';
const CREATOR_MODE = 'creator';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      mode: CREATOR_MODE,
      pools: [],
      infoListItems: [
        {
          icon: <WalletIcon/>,
          text: 'Currently invested 6 Eth',
          action: () => { console.log('actioned')}
        },
        {
          icon: <WalletIcon/>,
          text: 'Claim your token from Nexo',
          action: () => { console.log('actioned')}
        },
        {
          icon: <WalletIcon/>,
          text: 'Knowledgebase Contact Support',
          action: () => { console.log('actioned')}
        },
      ]
    };

    this.handleModeChange = this.handleModeChange.bind(this);
  }

  handleModeChange(event, mode) {
    this.setState({ mode });
  }
  componentWillMount() {
    isLoggedIn(this.props.currentUser);
  }
  async componentDidMount() {
    // console.log('this.props.currentUser.id', this.props.currentUser.id);
    try {
      const pools = await PoolService.getByOwnerId(this.props.currentUser.id);

      this.setState({ isLoading: false });
      this.contributionObserver = ContributionService.getUserContributions(
        this.props.currentUser.id,
        contributions => {
          console.log('contributions', contributions);
          this.setState({
            contributions,
            pools,
            isLoading: false,
          })
        },
        err => {
          console.log('err', err);
        }
      );
    } catch(err) {
      this.setState({ isLoading: false });
      console.log('err', err);
    }
  }

  componentWillUnMount() {
    if (this.contributionObserver) this.contributionObserver.unsubscribe()
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div id="dashboard-view">
        {isLoading && <Loader className="fixed" />}
        {!isLoading && (
          <div>
            <div className="header">
              <div className="container">
                <div className="row no-gutters">
                  <div className="col-md-8 offset-md-2">
                    <Tabs
                      value={this.state.mode}
                      onChange={this.handleModeChange}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                    >
                      <Tab label="Contributor" value={CONTRIBUTOR_MODE}/>
                      <Tab label="Creator" value={CREATOR_MODE}/>
                    </Tabs>
                  </div>
                  <div className="col-md-2 align-self-center">
                    {
                      this.state.mode === CREATOR_MODE ?
                        <Button type="button" size="small" variant="contained" color="primary" onClick={() => history.push('/pools/create')}>
                          Create Pool
                        </Button> :
                        <Button type="button" size="small" variant="contained" color="primary" onClick={() => history.push('/pools/create')}>
                          How to contribute
                        </Button>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="container main-wrap">
              <div className="row">
                <div className="col-md-4">
                  <Paper>
                    <InfoList items={this.state.infoListItems}/>
                  </Paper>
                  <Paper className="mt-4">
                    <WalletList wallets={this.props.currentUser.wallets}/>
                  </Paper>
                </div>
                <div className="col-md-8">
                  <Paper>
                  {
                    this.state.mode === CREATOR_MODE ?
                      <PoolList pools={this.state.pools} currentUser={this.props.currentUser}/> :
                      <ContributionList contributions={this.state.contributions} currentUser={this.props.currentUser}/>
                  }
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};


Dashboard.propTypes = {
  currentUser: PropTypes.instanceOf(User)
};

export default Dashboard;
