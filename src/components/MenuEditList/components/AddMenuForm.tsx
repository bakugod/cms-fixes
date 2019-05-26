import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Form, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { get } from 'lodash';
import { IModule } from 'react-cms';

import { IReducers } from '../../../redux';
import { getModules } from '../../../redux/common/common.selector';
import { MenuEditListApi } from '../api/menuEditList';

import Input from '../../../components/Input/Input';
import AutoComplete from '../../../components/Autocomplete/Autocomplete';
import CheckBox from '../../../components/CheckBox/CheckBox';

interface IProps extends FormComponentProps {
  modules?: IModule[];
  addMenu?: (pack: object) => void;
  onSend?: (values?) => void;
}

class AddMenuForm extends React.Component<IProps> {
  public render(): JSX.Element {
    const {form, modules} = this.props;
    const {getFieldDecorator} = form;
    
    return (
      <Form onSubmit={ this.onHandleSubmit }>
        <Form.Item>
          { getFieldDecorator('name', {
            rules: [{ required: true, message: 'Введите значение' }],
          })(
            <Input placeholder={ 'Название' } />,
          ) }
        </Form.Item>
  
        <Form.Item>
          { getFieldDecorator('pic', {
            rules: [{ required: true, message: 'Введите значение' }],
          })(
            <Input placeholder={ 'URL картинки' } />,
          ) }
        </Form.Item>
  
        <Form.Item>
          { getFieldDecorator('module', {
            rules: [{ required: true, message: 'Введите значение' }],
          })(
            <AutoComplete placeholder={ 'Модуль' } data={ modules.map(item => item.name) } />,
          ) }
        </Form.Item>
  
        <Form.Item>
          { getFieldDecorator('customColor', {
            rules: [{ required: false, message: 'Введите значение' }],
          })(
            <CheckBox text={ 'Особый цвет' } />,
          ) }
        </Form.Item>
  
        <Form.Item>
          { getFieldDecorator('color', {
            rules: [{ required: false, message: 'Введите значение' }],
            initialValue: 'ffffff',
          })(
            <Input placeholder={ 'Цвет' } />,
          ) }
        </Form.Item>
        
        <Button htmlType={ 'submit' } type={ 'primary' } style={ {position: 'relative', left: '87%', top: 10} }>
          Добавить
        </Button>
      </Form>
    );
  }
  
  private onHandleSubmit =event => {
    event.preventDefault();

    const {form, onSend, modules, addMenu} = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        addMenu({
          ...values,
          module: get(modules.find(item => item.name === get(values, 'module', '')), 'id', ''),
          color: `#${get(values, 'color', 'ffffff')}`,
          customColor: +get(values, 'customColor', false),
        });
        
        if (onSend) {
          onSend(values);
        }
      }
    });
  };
}

const mapStateToProps = (state: IReducers) => {
  return {
    modules: getModules(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    addMenu: (pack: object) => dispatch(MenuEditListApi.addMenu(pack)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddMenuForm));
