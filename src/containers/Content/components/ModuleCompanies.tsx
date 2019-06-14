import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Card, Button, Modal } from 'antd';
import { EnumTarget, IContainer, ICompanyList, ICompany, ICompanyGroup, ICompanyJoin } from 'react-cms';
import { get } from 'lodash';
import { Column, RowInfo } from 'react-table';
import ReactTable from 'react-table';

import { IReducers } from '../../../redux';
import { ContentAPI } from '../api/content';
import { getContainer, getMenuData } from '../../../redux/common/common.selector';

import { MenuEditListApi } from '../../../components/MenuEditList/api/menuEditList';
import FakeImg from '../../../components/FakeImg/FakeImg';
import EditCompany from './EditCompany';

interface IProps {
  container?: IContainer;
  getMenuData?: (enumTarget: EnumTarget) => void;
  companies?: ICompany[];
  companiesGroups?: ICompanyGroup[];
}

interface IState {
  modalVisible: boolean;
  isAdd: boolean;
  currentEntity: ICompanyJoin | null;
  currentIndex: number;
}

class ModuleCompanies extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    companies: [],
    companiesGroups: [],
  };
  private static columns: Column[] = [
    {
      Header: 'Компания',
      accessor: 'companyName',
    },
    {
      Header: 'Группа компании',
      accessor: 'companyGroupName',
    },
    {
      Header: 'Анонс',
      accessor: 'announce',
    },
    {
      Header: 'Описание',
      accessor: 'description',
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
    {
      Header: 'Видимость',
      accessor: 'visible',
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

  public componentDidMount() {
    const {getMenuData} = this.props;

    getMenuData('company');
    getMenuData('company_groups');
  }

  public render(): JSX.Element {
    const {container: {data, isLoading}, companies, companiesGroups} = this.props;
    const {modalVisible, isAdd, currentEntity} = this.state;

    return (
      <Card
        title={ <Button icon={ 'plus' } onClick={ this.onOpenAddModal }>Добавить</Button> }
      >
        <ReactTable
          data={ data.map((item: ICompanyList) => {
            const company: ICompany = companies.find((company: ICompany) => company.id === item.company_id);
            const group: ICompanyGroup = companiesGroups.find((group: ICompanyGroup) => group.id === item.company_group);

            return ({
              ...item,
              img: get(company, 'img', ''),
              companyName: get(company, 'name', ''),
              companyGroupName: get(group, 'name', ''),
              announce: get(company, 'announce', '').slice(0, 200),
              description: get(company, 'description', '').slice(0, 200),
              announceFull: get(company, 'announce', ''),
              descriptionFull: get(company, 'description', ''),
              visible: Boolean(item.visible) ? 'Да' : 'Нет',
            });
          }) }
          columns={ ModuleCompanies.columns }
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
          <EditCompany
            entity={ currentEntity }
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
    companies: getMenuData(state, 'company'),
    companiesGroups: getMenuData(state, 'company_groups'),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    updateContainer: (id: number, action: string, data: object, cb?: () => void) => dispatch(ContentAPI.updateContainer(id, action, data, cb)),
    getMenuData: (enumTarget: EnumTarget) => dispatch(MenuEditListApi.getMenuData(enumTarget)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModuleCompanies);
