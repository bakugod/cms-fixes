import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Layout, Row, Col, Icon } from 'antd';
import { IUser } from 'react-cms';
import { get } from 'lodash';
import styled from 'styled-components';

import { getUserData } from '../../redux/auth/auth.selector';
import { IReducers } from '../../redux';
import { AuthApi } from '../../redux/auth/auth.api';

const HeaderWrapper = styled.div`
  .ant-row span {
    color: #ffffff;
  }
  
  .ant-layout-header {
    position: fixed;
    width: 100%;
    z-index: 9999;
  }
  
  .ant-col-6 {
    line-height: 26px;
  }
`;

const LogoutButton = styled.span`
  color: #ffffff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

interface IProps {
  user?: IUser;
  logout?: () => void;
}

class Header extends React.Component<IProps> {
  public render(): JSX.Element {
    const {user, logout} = this.props;

    return (
      <HeaderWrapper>
        <Layout.Header>
            <Row>
              <Col span={ 6 }>
                <p>
                  <span style={ {fontSize: '16pt', fontWeight: 'bold'} }>{ user.appdata.eventName }</span>
                  <br />
                  <span>{ user.appdata.name }</span></p>
              </Col>

              <Col span={ 5 } offset={ 9 }>
                <span>{ user.user_name || 'Имени нет' }</span>
              </Col>

              <Col span={ 4 }>
                <LogoutButton onClick={ logout }>Выйти</LogoutButton>
              </Col>
            </Row>
        </Layout.Header>
      </HeaderWrapper>
    );
  }
}

const mapStateToProps = (state: IReducers) => {
  return {
    user: getUserData(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    logout: () => dispatch(AuthApi.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
