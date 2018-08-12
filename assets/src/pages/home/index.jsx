import React from 'react';
import { connect } from 'dva';
import { Upload, message, Button, Icon } from 'antd';
import './index.less';


class Home extends React.Component {
  constructor() {
    super();
  }

  render() {
    const props = {
      name: 'file',
      action: '/system/api/issue/file/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(info.file.response.message)
          // message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div className="home">
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
      </div>  
    );
  }
}



export default connect((({ home }) => {
  return {
    home
  }
}))(Home);
