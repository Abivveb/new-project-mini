import React from 'react'
import './App.scss'
import { db, storage } from '../../config'
import { ModalUpload } from '../ModalUpload'
import { onValue, ref } from 'firebase/database'

export const App = () => {
  const [isShowModal, setIsShowModal] = React.useState(false)
  const [images, setImages] = React.useState([])
  const [ind, setInd] = React.useState(0)
  const imgs = images.length - 1

  React.useEffect(() => {
    const refPost = ref(db, 'posts')
    onValue(refPost, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      setImages(data.imageUrl)
    })

  }, [isShowModal])

  
  const swipeSlide = () => {
    if(ind > imgs){
      setInd(0)
    }
    else if(ind < 0){
      setInd(imgs)
    }

  }


  
  const swipeLeft = () => {
    if(ind == 0){
      console.log('start')
    }else{
      setInd(ind - 1)
      swipeSlide()
    }
  }

  const swipeRight = () => {
    if(ind == imgs){
      console.log('end')
    }else{
      setInd(ind + 1)
      swipeSlide()
    }
  }





  
  

  return (
    <div className="app">
      <button 
      className="app__btn"
      onClick={() => setIsShowModal(true)}
      >Select files</button>
      { isShowModal && < ModalUpload setIsShowModal={setIsShowModal}/>}
      { !isShowModal && <div className="posts">
        
        <div className="post">
          <div className="post__slider">
            <div 
            style={{
              transform: `translateX(${-ind * 500}px)`
            }}
            className="post__slide">
              
              { images.map(img => (
                <img src={img} alt="" />
              ))}
            </div>
              <button
              style={{
                visibility: ind == 0 ? 'hidden' : 'visible'
              }}
              className="post__left" onClick={swipeLeft}>L</button>
              
              <button
              style={{
                visibility: ind == imgs ? 'hidden' : 'visible'
              }}
              className="post__right" onClick={swipeRight}>R</button>
          </div>
        </div>

      </div>}
    </div>
            
  )
}
