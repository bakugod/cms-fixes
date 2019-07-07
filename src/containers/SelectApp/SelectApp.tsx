import * as React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Card, Icon, Menu, Dropdown, notification, Badge } from 'antd';

import { range } from 'lodash';
import { IAppsList, IUser } from 'react-cms';

import { withRouter } from 'react-router-dom';


import './Apps.scss';

import { IReducers } from '../../redux';
import { EventsAPI } from './api/select-app';
import { getApps } from '../../redux/common/common.selector';
import { IEventData } from '../../redux/auth/auth.reducer';

import { getUserData } from '../../redux/auth/auth.selector';
import b from '../../service/Utils/b';

interface IProps {
  user?: IUser;
  apps?: IAppsList[];
  getApps?: () => void;
}

class SelectApp extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  private static rowsNumber: number = 3;

  private onUpdateEvent = (event: IEventData) => () => this.props.getApps();
  private onAddNotification = () => notification.warning({ message: '!', description: 'Для создания нового приложения обратитесь в SDNA' });
  private onSelectApp = (id: number) => {
    //@ts-ignore
    return Promise.resolve(this.props.selectApps(id))
  };//notification.warning({ message: '!', description: 'Для выбора приложения обратитесь в SDNA' });


  public componentDidMount() {
    const { getApps } = this.props;
    getApps();
  }

  public render(): JSX.Element {
    const { apps, user } = this.props;

    if (!apps.some(item => item.id === -1)) {
      apps.push({ ...apps[0], id: -1 });
    }

    const rows: number = Math.ceil(apps.length / SelectApp.rowsNumber);
    let currentIndex: number = 0;


    return (
      <Card style={{ height: '100vh' }}>
        <h1>Мои приложения</h1>
        {
          range(0, rows).map(index => (
            <div className={b('apps', 'parent')} key={index}>
              {
                range(0, SelectApp.rowsNumber).map(columnIndex => {
                  if (currentIndex === apps.length) {
                    return <React.Fragment key={`no_${columnIndex}`} />;
                  }

                  const event: any = apps[currentIndex];
                  currentIndex += 1;
                  const cardData: JSX.Element = (
                    <Card
                      className={b('apps', 'child')}
                      onClick={() => this.onSelectApp(event.id)}
                    >
                      <Card.Meta
                        title={event.name + event.id}
                      />
                      <Icon
                        type={'caret-right'}
                        style={{
                          position: 'relative',
                          transform: 'translateY(-50%) scale(3, 3)',
                          top: 55,
                          left: '47%',
                        }}
                      />
                    </Card>
                  );

                  return (
                    <React.Fragment key={`column_${columnIndex}`}>
                      {
                        event.id !== -1
                          ? cardData
                          : (
                            <Card
                              className={b('apps', 'child')}
                              style={{
                                textAlign: 'center',
                              }}
                              onClick={this.onAddNotification}
                            >
                              <Card.Meta
                                title={"Добавить приложение"}
                              />
                              <Icon
                                type={'plus'}
                                style={{
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  position: 'relative',
                                  transform: 'translateY(-50%) scale(3, 3)',
                                  top: 68,
                                }}
                              />
                            </Card>
                          )
                      }
                    </React.Fragment>
                  );
                })
              }
            </div>
          ))
        }
      </Card>
    );
  }
}

const mapStateToProps = (state: IReducers) => {
  return {
    apps: getApps(state),
    user: getUserData(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    getApps: () => dispatch(EventsAPI.getApps()),
    selectApps: (app: number) => dispatch(EventsAPI.selectApps(app))
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SelectApp);

