import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';

export default class CarouselModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: props.photoIndex
    }
    
  }

  UNSAFE_componentWillReceiveProps(nextProps)
  {
    if(this.props != nextProps){
      this.setState({photoIndex: nextProps.photoIndex});
    }
  }

  componentWillUnmount()
  {
    this.setState({photoIndex: 0});
  }

  render() {
    const { isOpen, images, onClose } = this.props;
    const photoIndex = this.state.photoIndex;
    return (
      <div>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={onClose}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>{
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              });
              }
            }
          />
        )}
      </div>
    );
  }
}