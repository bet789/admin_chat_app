import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, Space, Layout, Typography, Button, Switch, Modal } from "antd";
import { Link } from "react-router-dom";
import axios from 'axios'
import toast, {Toaster} from 'react-hot-toast'

import logo from "../assets/images/taipei101.png";
import config from "../helpers/config";

const { Header } = Layout;
const { Text } = Typography;

const items = [
  {
    key: "1",
    label: <Link to="/logout">Đăng Xuất</Link>,
  },
];

const infoUsers = sessionStorage.getItem("infoUsers")
  ? JSON.parse(sessionStorage.getItem("infoUsers"))
  : null;

export default function HeaderCustom() {
  const [isShowImportExcelModal, setIsShowImportExcelModal] = useState(false)
	const [isShowImportMessageModal, setIsShowImportMessageModal] = useState(false)
  const [excelFile, setExcelFile] = useState()
	const [messageFile, setMessageFile] = useState()
  const [messageControl, setMessageControl] = useState()

  const handleImportFileExcel = () => {
		if(excelFile){
			const reader = new FileReader();
        
        reader.onload = async function(e) {
            const content = reader.result;
            // Here the content has been read successfuly
            const arrayOfUser = content?.toString().split("\r\n").filter(item => item)
			try {
				const importMessage = await axios.post(`${config.api.API_URL_DEV}/file/importUsers`, {users: arrayOfUser})

				toast.success("Import người dùng thành công")
			} catch (error) {
				console.log(error)
				toast.error("Import that bai")
			}
        }
        
        reader.readAsText(excelFile);
		}
	}

  const getMessageControl = async () => {
		try {
			axios.get(`${config.api.API_URL_DEV}/api/chat/get-message-control`).then(res => {
				setMessageControl(res)
			})
		} catch (error) {	
			console.log(error)
		}
	}




	const handleImportFileMessage = () => {
		if(messageFile){
			const reader = new FileReader();
        
        reader.onload = async function(e) {
            const content = reader.result;
            // Here the content has been read successfuly
            const arrayOfMessage = content?.toString().split("\r\n").filter(item => item)
			try {
				const importMessage = await axios.post(`${config.api.API_URL_DEV}/file/importMessage`, {messages: arrayOfMessage})

				toast.success("Import người tin nhắn thành công")
			} catch (error) {
				console.log(error)
				toast.error("Import that bai")

			}
        }
        
        reader.readAsText(messageFile);
		}
	}

	const handleChangeFileMessage = (file) => {
		const acceptFileType = ["text/plain"]
		if(!acceptFileType.includes(file?.type)){
			toast.error("Chỉ được nhập vào text")
			return;
		}
		setMessageFile(file)
	}

	const handleChangeFileImport = (file) => {
		const acceptFileType = ["text/plain"]
		if(!acceptFileType.includes(file?.type)){
			toast.error("Chỉ được nhập vào text")
			return;
		}
		setExcelFile(file)
	}

	const handleChangeMessageControl = async (checked) => {
		try {
			const changeStatus = await axios.patch(`${config.api.API_URL_DEV}/api/chat/change-message-control-status`, {status: checked})
			getMessageControl()
		} catch (error) {
			console.log(error)
		}
	}
  useEffect(()=>{
    getMessageControl()
  },[])

  return (
    <Header className="header">
      <Toaster/>
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div>
        <Button type="primary" onClick={()=>setIsShowImportExcelModal(true)}>Import Fake User</Button>
        <Button onClick={()=>setIsShowImportMessageModal(true)} style={{marginLeft: '10px'}} type="primary">Import Fake Messages</Button>
        <Switch onChange={(value)=>handleChangeMessageControl(value)} checked={messageControl?.auto} style={messageControl?.auto ? {marginLeft: '10px', background: 'green'}: {marginLeft: '10px', background: 'red'}}/><span style={{color: 'white', marginLeft: '5px'}}>Bật tự động chat</span>
      </div>
        
      <Dropdown
        menu={{
          items,
        }}
      >

        <Space className="ant-space-item-header">
         
          <Avatar
            style={{
              backgroundColor: `#${Math.floor(
                Math.random() * 16777215
              ).toString(16)}`,
              verticalAlign: "middle",
            }}
            size={30}
          >
            {infoUsers?.user?.fullName.charAt(0)}
          </Avatar>
          <div className="group-info-sidebar">
            <Text className="username-sidebar" strong>
              {infoUsers?.user?.fullName}
            </Text>
            <Text className="rolename-sidebar">
              {infoUsers?.user?.role?.roleName}
            </Text>
          </div>
        </Space>
      </Dropdown>
      <Modal
				open={isShowImportExcelModal}
        onOk={()=>handleImportFileExcel()}
        onCancel={()=>setIsShowImportExcelModal(false)}
			>
					<input type='file' onChange={(e)=>handleChangeFileImport(e.target?.files?.[0])} />
			</Modal>
			<Modal
				open={isShowImportMessageModal}
        onOk={()=>handleImportFileMessage()}
        onCancel={()=>setIsShowImportMessageModal(false)}
			>
					<input type='file' onChange={(e)=>handleChangeFileMessage(e.target?.files?.[0])} />
			</Modal>
    </Header>
  );
}
