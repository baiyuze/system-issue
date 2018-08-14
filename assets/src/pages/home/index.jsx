import React from 'react';
import { connect } from 'dva';
import { Upload, message, Button, Icon } from 'antd';
import './index.less';
import $ from 'jquery';

class Home extends React.Component {
  constructor() {
    super();
  }

  startIssue() {
    $.post('/system/api/issue/start',(json) => {
      console.log(json,'json')
    })
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
        <Button onClick={this.startIssue.bind(this)}>发布</Button>
      </div>  
    );
  }
}



export default connect((({ home }) => {
  return {
    home
  }
}))(Home);
