import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios';
import config from "../../helpers/config";
import { BiEdit } from 'react-icons/bi'
import { BsTrash } from 'react-icons/bs'
import { Button, Input, Modal, Popconfirm, Switch, Table } from 'antd';
import { useEffect, useState } from 'react';

const ModalCreate = ({ handleCreateOrUpdateMessage, isOpen, onClose, setNewMessage, selectedMessage, newMessage}) => {
    return (
        <Modal open={isOpen} onCancel={onClose} onOk={handleCreateOrUpdateMessage}>
            <Input type='text' value={newMessage || selectedMessage?.content} onChange={(e) => setNewMessage(e.target.value)}/>
        </Modal>
    )
}

const ChatManagement = () => {
    const [isShowImportMessageModal, setIsShowImportMessageModal] = useState(false)
    const [messageFile, setMessageFile] = useState()
    const [messageControl, setMessageControl] = useState()
    const [modalCreateMessage, setModalCreateMessage] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [selectedMessage, setSelectedMessage] = useState()

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
            axios.get(`${config.api.API_URL_DEV}/api/chat/get-fake-message`).then(res => {
                console.log(res)
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
                    const importMessage = await axios.post(`${config.api.API_URL_DEV}/api/file/importMessage`, { messages: arrayOfMessage })
                    getAllFakeMessage()
                    setIsShowImportMessageModal(false)
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
                return <div><span style={{cursor: 'pointer'}}>
                    <BiEdit onClick={()=>{setSelectedMessage(record); setModalCreateMessage(true)}}/></span><span style={{marginLeft: '10px', cursor: 'pointer'}}></span>
                    <Popconfirm
                        placement="topRight"
                        title={"Bạn có chắc chắn xóa message này?"}
                        onConfirm={()=>handleDeleteMessage(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                    <BsTrash/>
                    </Popconfirm>
                    </div>
            }
        }
    ]


    const createUpdateMessage = async () => {
        try {
            if(selectedMessage){
                axios.patch(`${config.api.API_URL_DEV}/api/chat/update-fake-message/${selectedMessage?._id || ""}`, {message: newMessage || selectedMessage?.content}).then(res => {
                    if(res?.status == 1){
                        toast.success("Cập nhật tin nhắn thành công")
                        getAllFakeMessage()
                        setModalCreateMessage(false)
                    }
                })
            }else{
                axios.post(`${config.api.API_URL_DEV}/api/chat/add-fake-message`, {message: newMessage}).then(res => {
                    if(res?.status == 1){
                        toast.success("Tạo tin nhắn thành công")
                        getAllFakeMessage()
                        setModalCreateMessage(false)
                    }
                })
            }
            setSelectedMessage(null)
            
        } catch (error) {
            toast.error("Thất bại")
        }
    }

    const handleDeleteMessage = async (id) => {
        try {
            axios.delete(`${config.api.API_URL_DEV}/api/chat/delete-fake-message/${id}`).then(res => {
                if(res.status == 1){
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
                    <Button onClick={()=>{setModalCreateMessage(true)}} type='primary'>Thêm message fake</Button>
                    <Button onClick={() => setIsShowImportMessageModal(true)} style={{ marginLeft: '10px' }} type="primary">Import Fake Messages</Button>
                    <Switch onChange={(value) => handleChangeMessageControl(value)} checked={messageControl?.auto} style={messageControl?.auto ? { marginLeft: '10px', background: 'green' } : { marginLeft: '10px', background: 'red' }} /><span style={{ color: 'black', marginLeft: '5px' }}>Bật tự động chat</span>
                </div>
                <Table
                    style={{marginTop: '20px'}}
                    pagination
                    columns={colum}
                    dataSource={messages}
                />
            </div>
            <Modal
                open={isShowImportMessageModal}
                onOk={() => handleImportFileMessage()}
                onCancel={() => setIsShowImportMessageModal(false)}
            >
                <input type='file' onChange={(e) => handleChangeFileMessage(e.target?.files?.[0])} />
            </Modal>
            <ModalCreate newMessage={newMessage} selectedMessage={selectedMessage} handleCreateOrUpdateMessage={createUpdateMessage} onClose={()=>{setModalCreateMessage(false); setSelectedMessage(null)}} setNewMessage={setNewMessage} isOpen={modalCreateMessage} />
        </>
    )
}

export default ChatManagement
