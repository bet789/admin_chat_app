import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios';
import logo from "../assets/images/taipei101.png";
import config from "../../helpers/config";
import { BiEdit } from 'react-icons/bi'
import { BsTrash } from 'react-icons/bs'
import { Input, Modal, Table } from 'antd';
import { useState } from 'react';

const ModalCreate = ({ handleCreateOrUpdateMessage, isOpen, onClose, setNewMessage}) => {
    return (
        <Modal open={isOpen} onCancel={onClose} onOk={handleCreateOrUpdateMessage}>
            <Input type='text' onChange={(e) => setNewMessage(e.target.value)}/>
        </Modal>
    )
}

const ChatManagement = () => {
    const [isShowImportExcelModal, setIsShowImportExcelModal] = useState(false)
    const [isShowImportMessageModal, setIsShowImportMessageModal] = useState(false)
    const [excelFile, setExcelFile] = useState()
    const [messageFile, setMessageFile] = useState()
    const [messageControl, setMessageControl] = useState()
    const [modalCreateMessage, setModalCreateMessage] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [selectedMessage, setSelectedMessage] = useState()

    const handleImportFileExcel = () => {
        if (excelFile) {
            const reader = new FileReader();

            reader.onload = async function (e) {
                const content = reader.result;
                // Here the content has been read successfuly
                const arrayOfUser = content?.toString().split("\r\n").filter(item => item)
                try {
                    const importMessage = await axios.post(`${config.api.API_URL_DEV}/file/importUsers`, { users: arrayOfUser })

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

    const getAllFakeMessage = async () => {
        try {
            axios.get(`${config.api.API_URL_DEV}/api/chat/get-fake-message`, {message: newMessage}).then(res => {
                setMessages(res)
            })
        } catch (error) {
            console.log(error)
        }
    }


    const handleImportFileMessage = () => {
        if (messageFile) {
            const reader = new FileReader();

            reader.onload = async function (e) {
                const content = reader.result;
                // Here the content has been read successfuly
                const arrayOfMessage = content?.toString().split("\r\n").filter(item => item)
                try {
                    const importMessage = await axios.post(`${config.api.API_URL_DEV}/file/importMessage`, { messages: arrayOfMessage })

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
        if (!acceptFileType.includes(file?.type)) {
            toast.error("Chỉ được nhập vào text")
            return;
        }
        setMessageFile(file)
    }

    const handleChangeFileImport = (file) => {
        const acceptFileType = ["text/plain"]
        if (!acceptFileType.includes(file?.type)) {
            toast.error("Chỉ được nhập vào text")
            return;
        }
        setExcelFile(file)
    }

    const handleChangeMessageControl = async (checked) => {
        try {
            const changeStatus = await axios.patch(`${config.api.API_URL_DEV}/api/chat/change-message-control-status`, { status: checked })
            getMessageControl()
        } catch (error) {
            console.log(error)
        }
    }

    const colum = [
        {
            title: "Message",
            dataIndex: "content",
            key: "content"
        },
        {
            title: "Action",
            dataIndex: "_id",
            key: "action",
            render: (row, record) => {
                return <div><span style={{cursor: 'pointer'}}><BiEdit onClick={()=>{setSelectedMessage(record?._id); setModalCreateMessage(true)}}/></span><span style={{marginLeft: '10px', cursor: 'pointer'}}><BsTrash/></span></div>
            }
        }
    ]

    const createUpdateMessage = async () => {
        try {
            if(selectedMessage){
                axios.patch(`${config.api.API_URL_DEV}/api/chat/update-fake-message/${selectedMessage?._id || ""}`, {message: newMessage || selectedMessage?.content}).then(res => {
                    if(res.data?.status == 1){
                        toast.success("Cập nhật tin nhắn thành công")
                        getAllFakeMessage()
                    }
                })
            }else{
                axios.post(`${config.api.API_URL_DEV}/api/chat/add-fake-message`, {message: newMessage}).then(res => {
                    if(res.data?.status == 1){
                        toast.success("Tạo tin nhắn thành công")
                        getAllFakeMessage()
                    }
                })
            }
            
        } catch (error) {
            toast.error("Thất bại")
        }
    }

    const handleDeleteMessage = async (id) => {
        try {
            axios.delete(`${config.api.API_URL_DEV}/api/chat/delete-fake-message.${id}`).then(res => {
                if(res.data?.status == 1){
                    toast.success("Xoá tin nhắn thành công")
                    getAllFakeMessage()
                }
            })
        } catch (error) {
            toast.error("Xoá message thành công")
        }
    }

    useEffect(() => {
        getMessageControl()
        getAllFakeMessage()
    }, [])

    return (
        <>
            <div>
                <div>
                    <Button type="primary" onClick={() => setIsShowImportExcelModal(true)}>Import Fake User</Button>
                    <Button onClick={() => setIsShowImportMessageModal(true)} style={{ marginLeft: '10px' }} type="primary">Import Fake Messages</Button>
                    <Switch onChange={(value) => handleChangeMessageControl(value)} checked={messageControl?.auto} style={messageControl?.auto ? { marginLeft: '10px', background: 'green' } : { marginLeft: '10px', background: 'red' }} /><span style={{ color: 'white', marginLeft: '5px' }}>Bật tự động chat</span>
                </div>
                <Table
                    pagination
                    columns={colum}
                    dataSource={messages}
                />
            </div>
            <Modal
                open={isShowImportExcelModal}
                onOk={() => handleImportFileExcel()}
                onCancel={() => setIsShowImportExcelModal(false)}
            >
                <input type='file' onChange={(e) => handleChangeFileImport(e.target?.files?.[0])} />
            </Modal>
            <Modal
                open={isShowImportMessageModal}
                onOk={() => handleImportFileMessage()}
                onCancel={() => setIsShowImportMessageModal(false)}
            >
                <input type='file' onChange={(e) => handleChangeFileMessage(e.target?.files?.[0])} />
            </Modal>
            <ModalCreate handleCreateOrUpdateMessage={createUpdateMessage} onClose={setModalCreateMessage} setNewMessage={setNewMessage} isOpen={modalCreateMessage} />
        </>
    )
}

export default ChatManagement