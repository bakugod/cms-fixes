import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Switch, Card, Button, Modal, Col, Row } from 'antd';
import { IContainer, IPeopleList } from 'react-cms';
import { get } from 'lodash';
import { Column, RowInfo } from 'react-table';
import ReactTable from 'react-table';
import * as moment from 'moment';

import { IReducers } from '../../../redux';
import { ContentAPI } from '../api/content';
import { DATE_FORMAT } from '../../../service/Consts/Consts';
import b from '../../../service/Utils/b';
import { getContainer } from '../../../redux/common/common.selector';

import FakeImg from '../../../components/FakeImg/FakeImg';
import EditPeople from './EditPeople';

interface IProps {
  container?: IContainer;
}

interface IState {
  modalVisible: boolean;
  isAdd: boolean;
  currentEntity: IPeopleList | null;
  currentIndex: number;
}

class ModulePeopleList extends React.Component<IProps, IState> {
  private static columns: Column[] = [
    {
      Header: 'Видимость',
      accessor: 'visible',
      Cell: (cellInfo: RowInfo) => (
        <Switch
          checked={Boolean(get(cellInfo, 'original.visible', 1))}
          className={b('content', 'module-table-switch-position', { 'without-location': !cellInfo.original.location_name })}
        />
      ),
      width: 100,
    },
    {
      Header: 'Обновлено',
      accessor: 'updated',
      Cell: (cellInfo: RowInfo) => {
        const data: any = get(cellInfo, 'original.updated_at');
        const updated = moment.unix(data).format(DATE_FORMAT);

        return (
          <Col style={{ textAlign: "right", }}>
            <p style={{ margin: 0 }}>{updated.slice(0, 10)}</p>
            <p>{updated.slice(10, 16)}</p>
          </Col>
        );
      },
      width: 100,
    },


  ];

  constructor(props: IProps) {
    super(props);

    this.state = {
      modalVisible: false,
      isAdd: false,
      currentEntity: null,
      currentIndex: 0,
    };
  }

  public render(): JSX.Element {
    const { container: { data, isLoading } } = this.props;
    const { modalVisible, isAdd, currentEntity } = this.state;
    console.log(data)

    return (
      <Card
        title={<Button icon={'plus'} onClick={this.onOpenAddModal}>Добавить</Button>}
      >
        <ReactTable
          data={data.map((item: IPeopleList) => ({
            ...item,
            visible: Boolean(item.visible) ? 1 : 0,
            updated: item.data.updated_at,
          }))}
          columns={ModulePeopleList.columns}
          pageSize={data.length}
          noDataText={'Нет информации'}
          loadingText={'Загрузка...'}
          loading={isLoading}
          className={'-striped -highlight'}
          getTrProps={this.onRowClick}
          showPagination={false}
          resizable={false}
          style={{ color: '#000000', }}
        />

        <Modal visible={modalVisible} footer={null} onCancel={this.onCloseModal} width={782}>
          <EditPeople
            people={currentEntity}
            closeModal={this.onCloseModal}
            isAdd={isAdd}
            type={isAdd ? 'POST' : 'PUT'}
          />
        </Modal>
      </Card>
    );
  }

  private onCloseModal = () => this.setState({ modalVisible: false });

  private onOpenAddModal = () => this.setState({ isAdd: true, modalVisible: true });

  private onRowClick = (state: any, rowInfo: RowInfo, column: any) => ({
    onClick: () => this.setState({
      currentIndex: rowInfo.index,
      currentEntity: rowInfo.original,
      modalVisible: true,
      isAdd: false,
    }),
    style: { cursor: 'pointer' },
  });
}

const mapStateToProps = (state: IReducers) => {
  return {
    container: getContainer(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    updateContainer: (id: number, action: string, data: object, cb?: () => void) => dispatch(ContentAPI.updateContainer(id, action, data, cb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModulePeopleList);
