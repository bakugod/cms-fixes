import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Card, Button, Modal } from 'antd';
import { IContainer, IPeopleList } from 'react-cms';
import { get } from 'lodash';
import { Column, RowInfo } from 'react-table';
import ReactTable from 'react-table';

import { IReducers } from '../../../redux';
import { ContentAPI } from '../api/content';
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
      Header: 'ФИО',
      accessor: 'peopleName',
    },
    {
      Header: 'Группа',
      accessor: 'people_group_name',
    },
    {
      Header: 'Видимость',
      accessor: 'visible',
    },
    {
      Header: 'Фото',
      accessor: 'img',
      Cell: (cellInfo: RowInfo) => {
        const image: string = get(cellInfo, 'original.img');

        return (
          <React.Fragment>
            {
              image.includes('http')
                ? <img
                  src={ image }
                  style={ {maxWidth: 100, maxHeight: 100} }
                />
                : <FakeImg />
            }
          </React.Fragment>
        );
      },
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
    const {container: {data, isLoading}} = this.props;
    const {modalVisible, isAdd, currentEntity} = this.state;

    return (
      <Card
        title={ <Button icon={ 'plus' } onClick={ this.onOpenAddModal }>Добавить</Button> }
      >
        <ReactTable
          data={ data.map((item: IPeopleList) => ({
            ...item,
            visible: Boolean(item.visible) ? 'Да' : 'Нет',
            img: item.data.img,
            peopleName: item.data.name,
          })) }
          columns={ ModulePeopleList.columns }
          defaultPageSize={ 15 }
          noDataText={ 'Нет информации' }
          loadingText={ 'Загрузка...' }
          loading={ isLoading }
          className={ '-striped -highlight' }
          getTrProps={ this.onRowClick }
          showPagination
          resizable={ false }
          style={ {color: '#000000'} }
        />

        <Modal visible={ modalVisible } footer={ null } onCancel={ this.onCloseModal } width={ 782 }>
          <EditPeople
            people={ currentEntity }
            closeModal={ this.onCloseModal }
            isAdd={ isAdd }
            type={ isAdd ? 'POST' : 'PUT' }
          />
        </Modal>
      </Card>
    );
  }

  private onCloseModal = () => this.setState({modalVisible: false});

  private onOpenAddModal = () => this.setState({isAdd: true, modalVisible: true});

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
