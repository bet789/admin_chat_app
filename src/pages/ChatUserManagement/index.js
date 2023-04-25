import axios from "axios"
import { useEffect, useState } from "react"
import config from "../../helpers/config"
import { BsTrash } from "react-icons/bs"
import { Button, Input, Modal, Popconfirm, Table } from "antd"
import { toast } from "react-hot-toast"
import { BiEdit } from "react-icons/bi"

const ModalCreate = ({ handleCreateOrUpdateUser, isOpen, onClose, setNewUser, selectedUser, newUser}) => {
    console.log(selectedUser)
    return (
        <Modal open={isOpen} onCancel={onClose} onOk={handleCreateOrUpdateUser}>
            <Input type='text' value={newUser || selectedUser?.userName} onChange={(e) => setNewUser(e.target.value)}/>
        </Modal>
    )
}

const ChatUserManagement = () => {

    const [newUser, setNewUser] = useState("")
    const [users, setUsers] = useState([])
    const [isShowImportExcelModal, setIsShowImportExcelModal] = useState(false)
    const [excelFile, setExcelFile] = useState()
    const [selectedUser, setSelectedUser] = useState()
    const [modalCreateUser, setModalCreateUser] = useState(false)

    const handleImportFileExcel = () => {
        if (excelFile) {
            const reader = new FileReader();

            reader.onload = async function (e) {
                const content = reader.result;
                // Here the content has been read successfuly
                const arrayOfUser = content?.toString().split("\r\n").filter(item => item)
                try {
                    const importMessage = await axios.post(`${config.api.API_URL_DEV}/api/file/importUsers`, { users: arrayOfUser })
                    getAllFakeUser()
                    setIsShowImportExcelModal(false)
                    toast.success(importMessage?.message)   
                } catch (error) {
                    console.log(error)
                    toast.error("Import that bai")
                }
            }

            reader.readAsText(excelFile);
        }
    }

    const handleChangeFileImport = (file) => {
        const acceptFileType = ["text/plain"]
        if (!acceptFileType.includes(file?.type)) {
            toast.error("Chỉ được nhập vào text")
            return;
        }
        setExcelFile(file)
    }

    const handleDeleteUserFake = async (id) => {
        try {
            const result = await axios.delete(`${config.api.API_URL_DEV}/api/user/delete-fake-user/${id}`)

            if(result.status === 1){
                toast.success(result?.message)
                getAllFakeUser()
            }else{
                toast.error("Xóa thất bại")
            }
        } catch (error) {
            console.log(error)
            toast.error("Xóa thất bại")
        }
    }

    const column = [
        {
            title: "Username",
            dataIndex: "userName",
            key: "userName"
        },
        {
            title: "Action",
            dataIndex: "_id",
            key: "action",
            render: (row, record) => {
                return <div>
                     <span><BiEdit onClick={()=>{setSelectedUser(record); setModalCreateUser(true)}}/></span><span style={{marginLeft: '10px', cursor: 'pointer'}}></span>
                     <Popconfirm
                        placement="topRight"
                        title={"Bạn có chắc chắn xóa message này?"}
                        onConfirm={()=>handleDeleteUserFake(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <BsTrash/>
                    </Popconfirm>
                    </div>
            }
        }
    ]

    const getAllFakeUser = async () => {
        try {
            axios.get(`${config.api.API_URL_DEV}/api/user/get-fake-user`).then(res => {
                console.log(res)
                setUsers(res)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const createUpdateUser = async () => {
        try {
            if(selectedUser){
                axios.patch(`${config.api.API_URL_DEV}/api/chat/update-fake-user/${selectedUser?._id || ""}`, {userName: newUser || selectedUser?.userName}).then(res => {
                    if(res?.status == 1){
                        toast.success("Cập nhật người dùng fake thành công")
                        getAllFakeUser()
                        setModalCreateUser(false)
                    }
                })
            }else{
                axios.post(`${config.api.API_URL_DEV}/api/user/add-fake-user`, {userName: newUser}).then(res => {
                    console.log(res)

                    if(res?.status == 1){
                        toast.success("Tạo người dùng thành công")
                        getAllFakeUser()
                        setModalCreateUser(false)
                    }
                })
            }
            setSelectedUser(null)

        } catch (error) {
            toast.error("Thất bại")
        }
    }



    useEffect(() => {
        getAllFakeUser()
    }, [])

    return (
        <div>
            <div>
                <Button type="primary" onClick={()=>setModalCreateUser(true)}>Thêm người dùng fake</Button>
                <Button type="primary" onClick={() => setIsShowImportExcelModal(true)} style={{marginLeft: '10px'}}>Import Fake User</Button>
            </div>
            <Table
                style={{ marginTop: '20px' }}
                pagination
                columns={column}
                dataSource={users}
            />
            <Modal
                open={isShowImportExcelModal}
                onOk={() => handleImportFileExcel()}
                onCancel={() => setIsShowImportExcelModal(false)}
            >
                <input type='file' onChange={(e) => handleChangeFileImport(e.target?.files?.[0])} />
            </Modal>
            <ModalCreate selectedUser={selectedUser} newUser={newUser} handleCreateOrUpdateUser={createUpdateUser} onClose={()=>{setModalCreateUser(false); setSelectedUser(null)}} setNewUser={setNewUser} isOpen={modalCreateUser} />
        </div>
    )
}

export default ChatUserManagement