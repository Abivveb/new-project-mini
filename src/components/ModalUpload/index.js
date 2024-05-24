import React from 'react'
import './ModalUpload.scss'
import { db, storage } from '../../config'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { ref as refDB, set, onValue } from 'firebase/database'


export const ModalUpload = ( {setIsShowModal} ) => {

    const [images, setImages] = React.useState([])
    const [imageFiles, setImageFiles] = React.useState([])
    const [progressCount, setProgressCount] = React.useState([])

    const fileHanlder = (e) => {
        if(e.target.files.length === 1){
            const file = e.target.files[0]
            setImageFiles([file])

            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onload = () => {
                
                setImages([reader.result])
            }
        }
        else {
            
            const targetFiles = [...e.target.files]
           setImageFiles(targetFiles)
            const promiseFiles = targetFiles.map(file => {
                return new Promise ( (res, rej) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
        
                    reader.onload = () => {
                        res(reader.result)
                    }
                })
            })
            
            Promise.all(promiseFiles)
                .then(result => {
                    setImages(result)
                })
                

            

        }
    }


    

    const addPost = (urls) => {
       
        set(refDB(db, 'posts'), {
            imageUrl: urls
        })
    }


    const uploadFiles = () => {
        console.log(imageFiles)
        
       const urls = imageFiles.map(file => {
        return new Promise((res, rej) => {
            const storageRef = ref(storage, `images/${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on( 'state_changed', 
                (snapshot) => {
                    const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    console.log(progress)
                    setProgressCount(progress)
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            res(url)
                        })
                }
            )
        })
        })

        Promise.all(urls)
            .then(result => addPost(result))
            
       
    }

    const closeModal = (e) => {
        if(e.target.className === 'modal-upload'){
            setIsShowModal(false)
        }
    }
  return (
    <div className="modal-upload" onClick={closeModal}>
        <div className="modal-upload__wrapper">
            <div className="modal-upload__btns">
                <input 
                multiple
                onChange={fileHanlder}
                type="file"/>
                <button className="modal-upload__btn" onClick={uploadFiles}>UPLOAD</button>
            </div>
            <div className="modal-upload__images">
                {
                    images.map(img => (
                        <div className="image">

                            <img src={img} />
                            <div className='progress'>
                                    <div className="line" 
                                    style={{
                                        width: progressCount + '%'
                                    }}>
                                    </div>
                                    
                                    <div className="number">
                                    {progressCount}%
                                    </div>
                            </div>

                        </div>
                        
                    ))
                }
            </div>
        </div>
    </div>
  )
}
