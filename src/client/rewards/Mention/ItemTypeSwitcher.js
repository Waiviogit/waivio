import React, {useCallback} from 'react';
import { Form, Input, Select } from 'antd';

import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ImageSetter from '../../components/ImageSetter/ImageSetter';
import Image from '../../components/Image/Image';

import './ItemTypeSwitcher.less';
import {debounce} from "lodash";

const ItemTypeSwitcher = ({setPrimaryObject}) => {
  const [type, setType] = React.useState('object');
  const [avatar, setAvatar] = React.useState('');
  const getImages = image => {
    setAvatar(image);
  };
  const debounceInputUrl  = useCallback(debounce((value) => {
    console.log(value)
  }, [300]), [])

  const getInput = () => {
    switch (type) {
      case 'user':
        return (
          <Form.Item label={'Select User'}>
            <SearchUsersAutocomplete handleSelect={setPrimaryObject} />
          </Form.Item>
        );
      case 'object':
        return (
          <Form.Item label={'Select object'}>
            <SearchObjectsAutocomplete handleSelect={setPrimaryObject} autoFocus={false} />
          </Form.Item>
        );
      default: {
        return (<div>
          <Form.Item label={'External URL'}>
            <Input placeholder={'Enter an external URL'} onInput={}/>
          </Form.Item>
          <Form.Item label={'Mention descriptions'}>
            <Input type={'text'} placeholder={'Description'}/>
          </Form.Item>
          <Form.Item label={'Mention avatar'}>
            <ImageSetter onImageLoaded={getImages}/>
          </Form.Item>
        </div>)
    };
    }
  };

  return (
    <div>
      <Form.Item className={'ItemTypeSwitcher'} label={'Select mention type'}>
        <Select defaultValue={type} onSelect={setType}>
          <Select.Option value={'object'}>Object</Select.Option>
          <Select.Option value={'user'}>User</Select.Option>
          <Select.Option value={'url'}>Url</Select.Option>
        </Select>
      </Form.Item>
      <div>{getInput()}</div>
    </div>
  );
};

export default ItemTypeSwitcher;
