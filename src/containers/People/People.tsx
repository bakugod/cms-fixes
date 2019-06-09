import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Card, Modal, Button, Row, Col, Input, Icon } from 'antd';
import ReactTable, { Column, RowInfo } from 'react-table';
import { IPeople } from 'react-cms';
import { get } from 'lodash';
import * as moment from 'moment';

import { IReducers } from '../../redux';
import { PeopleAPI } from './api/people';
import { getPeople } from '../../redux/common/common.selector';
import { DATE_FORMAT } from '../../service/Consts/Consts';

import FakeImg from '../../components/FakeImg/FakeImg';
import EditForm from './components/EditForm';

interface IProps {
  people?: IPeople[];
  getPeople?: () => void;
}

interface IState {
  modalVisible: boolean;
  isAdd: boolean;
  currentPeople: IPeople | null;
}

class People extends React.Component<IProps, IState> {
  private static columns: Column[] = [
    {
      Header: 'Название',
      accessor: 'name',
      Cell: (cellInfo: RowInfo) => (
        <div style={ {height: 80} }>
          <Row gutter={ 24 }>
            <Col span={ 2 }>
              <React.Fragment>
                {
                  get(cellInfo, 'original.img').includes('http')
                    ? <img
                      src={ get(cellInfo, 'original.img') }
                      style={ {maxWidth: 50, maxHeight: 50} }
                    />
                    : <FakeImg />
                }
              </React.Fragment>
            </Col>

            <Col span={ 19 } offset={ 1 }>
              <p>{ cellInfo.original.name }</p>
              <span>{ cellInfo.original.mobile }</span>
            </Col>
          </Row>
        </div>
      ),
      width: 900,
    },
    {
      Header: 'Группа',
      accessor: 'category',
      width: 150,
    },
    {
      Header: 'Обновлено',
      accessor: 'updated',
      width: 150,
    },
  ];

  constructor(props: IProps) {
    super(props);

    this.state = {
      modalVisible: false,
      isAdd: false,
      currentPeople: null,
    };
  }

  public componentDidMount() {
    const {getPeople} = this.props;
    getPeople();
  }

  public render(): JSX.Element {
    const { people } = this.props;
    const { isAdd, modalVisible, currentPeople } = this.state;

    return (
      <Card
        style={ {marginLeft: 185, height: '100vh'} }
        title={ (
          <Row>
            <Col span={ 6 }>
              <Button icon={ 'plus' } onClick={ this.onOpenAddModal } type={ 'primary' }>Добавить спонсора</Button>
              <Button icon={ 'setting' } style={ {left: 10} } disabled />
            </Col>

            <Col span={ 5 } offset={ 13 }>
              <Input addonBefore={ <Icon type={ 'search' } /> } placeholder={ 'Поиск' } disabled />
            </Col>
          </Row>
        ) }
      >
        <ReactTable
          data={ people.map(item => ({
            ...item,
            category: 'Нет категории',
            updated: moment.unix(item.updated_at).format(DATE_FORMAT),
          })) }
          columns={ People.columns }
          noDataText={ 'Нет информации' }
          loadingText={ 'Загрузка...' }
          className={ '-striped -highlight' }
          getTrProps={ this.onRowClick }
          showPagination
          resizable={ false }
          style={ {color: '#000000'} }
        />

        <Modal visible={ modalVisible } footer={ null } onCancel={ this.onCloseModal } width={ 782 }>
          <EditForm
            people={ currentPeople }
            closeModal={ this.onCloseModal }
            isAdd={ isAdd }
            type={ isAdd ? 'POST' : 'PUT' }
          />
        </Modal>
      </Card>
    );
  }

  private onRowClick = (state: any, rowInfo: RowInfo, column: any) => ({
    onClick: () => this.setState({currentPeople: rowInfo.original, modalVisible: true, isAdd: false}),
    style: { cursor: 'pointer' },
  });

  private onCloseModal = () => this.setState({modalVisible: false});

  private onOpenAddModal = () => this.setState({isAdd: true, modalVisible: true});
}

const mapStateToProps = (state: IReducers) => {
  return {
    people: getPeople(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    getPeople: () => dispatch(PeopleAPI.getPeople()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(People);
