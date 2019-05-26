import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Card, Modal, Button, Icon, Row, Col, Input } from 'antd';
import ReactTable, { Column, RowInfo } from 'react-table';
import { EnumTarget, ILocation } from 'react-cms';
import * as moment from 'moment';

import { IReducers } from '../../redux';
import { getMenuData } from '../../redux/common/common.selector';
import { DATE_FORMAT } from '../../service/Consts/Consts';

import { MenuEditListApi } from '../../components/MenuEditList/api/menuEditList';
import EditForm from './components/EditForm';

interface IProps {
  locations?: ILocation[];
  getMenuData?: (enumTarget: EnumTarget) => void;
}

interface IState {
  modalVisible: boolean;
  isAdd: boolean;
  currentEntity: ILocation | null;
}

class Locations extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    locations: [],
  };
  private static columns: Column[] = [
    {
      Header: 'Название',
      accessor: 'name',
      Cell: (cellInfo: RowInfo) => (
        <div style={ {height: 80} }>
          <Row gutter={ 24 }>
            <Col span={ 2 }>
              <Icon type={ 'environment' } />
            </Col>
            <Col span={ 19 } offset={ 1 }>
              <p>{ cellInfo.original.name }</p>
              <span>{ cellInfo.original.address }</span>
            </Col>
          </Row>
        </div>
      ),
      width: 600,
    },
    {
      Header: 'Категория',
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
      currentEntity: null,
    };
  }

  public componentDidMount() {
    const {getMenuData} = this.props;
    getMenuData('locations');
  }

  public render(): JSX.Element {
    const {locations} = this.props;
    const {isAdd, modalVisible, currentEntity} = this.state;

    return (
      <Card
        style={ {marginLeft: 185} }
        title={ (
          <Row>
            <Col span={ 6 }>
              <Button icon={ 'plus' } onClick={ this.onOpenAddModal } type={ 'primary' }>Добавить локацию</Button>
              <Button icon={ 'setting' } style={ {left: 10} } disabled />
            </Col>

            <Col span={ 5 } offset={ 13 }>
              <Input addonBefore={ <Icon type={ 'search' } /> } placeholder={ 'Поиск' } disabled />
            </Col>
          </Row>
        ) }
      >
        <ReactTable
          data={ locations.map(item => ({
              ...item,
              descriptionShort: item.description.slice(0, 200),
              category: 'Нет категории',
              updated: moment.unix(item.updated_at).format(DATE_FORMAT),
            }),
          ) }
          columns={ Locations.columns }
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
            entity={ currentEntity }
            closeModal={ this.onCloseModal }
            type={ isAdd ? 'POST' : 'PUT' }
            isAdd={ isAdd }
          />
        </Modal>
      </Card>
    );
  }

  private onRowClick = (state: any, rowInfo: RowInfo, column: any) => ({
    onClick: () => this.setState({currentEntity: rowInfo.original, modalVisible: true, isAdd: false}),
    style: { cursor: 'pointer' },
  });

  private onCloseModal = () => this.setState({modalVisible: false});

  private onOpenAddModal = () => this.setState({isAdd: true, modalVisible: true});
}

const mapStateToProps = (state: IReducers) => {
  return {
    locations: getMenuData(state, 'locations'),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    getMenuData: (enumTarget: EnumTarget) => dispatch(MenuEditListApi.getMenuData(enumTarget)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Locations);
