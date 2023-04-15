import { Button, Modal, Switch } from "antd"
import { useEffect, useState } from "react"
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

import config from "../../helpers/config"

const ChatMangement = () => {
    const [isShowImportExcelModal, setIsShowImportExcelModal] = useState(false)
    const [isShowImportMessageModal, setIsShowImportMessageModal] = useState(false)
    const [excelFile, setExcelFile] = useState()
    const [messageFile, setMessageFile] = useState()
    const [messageControl, setMessageControl] = useState()
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
    useEffect(() => {
        getMessageControl()
    }, [])

    return (
        <div>
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
            <Button type="primary" onClick={()=>setIsShowImportExcelModal(true)}>Import Fake User</Button>
        <Button onClick={()=>setIsShowImportMessageModal(true)} style={{marginLeft: '10px'}} type="primary">Import Fake Messages</Button>
            <Switch onChange={(value)=>handleChangeMessageControl(value)} checked={messageControl?.auto} style={messageControl?.auto ? {marginLeft: '10px', background: 'green'}: {marginLeft: '10px', background: 'red'}}/><span style={{color: 'black', marginLeft: '5px'}}>Bật tự động chat</span>
        </div>
    )
}

export default ChatMangement