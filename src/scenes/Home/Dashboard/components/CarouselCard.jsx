import React, {useState} from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import useStyles from "./CarouselCard.style";
import classnames from "classnames";

export default function CarouselCard(props) {
  var classes = useStyles(props);
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const handlePrev = () => {
    setCurrentSlide(currentSlide - 1);

  }
  const handleNext = () => {
    setCurrentSlide(currentSlide + 1);
  }
  const updateCurrentSlide = (index) => {
    if (index !== currentSlide) {
      setCurrentSlide(index);
    }
  }
  return (
      <div className={classnames(classes.carouselCard)}>
        <Carousel showArrows="false" selectedItem={currentSlide} onChange={updateCurrentSlide} className={classnames(classes.carousel)}>
          {props.children}                              
        </Carousel>
        <div className={classnames(classes.handler)}>
          <button onClick={handlePrev} className={classnames(classes.button)}>
            <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.9062 3.375L1.90625 3.375" stroke="#15205B" strokeLinecap="round"/>
              <path d="M3.78125 5.8125L1.34375 3.375L3.78125 0.9375" stroke="#15205B" strokeLinecap="round"/>
            </svg>
            Previous
          </button>
          <button onClick={handleNext} className={classnames(classes.button)}>
            Next
            <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.25 3.375H11.25" stroke="#15205B" strokeLinecap="round"/>
              <path d="M9.375 0.9375L11.8125 3.375L9.375 5.8125" stroke="#15205B" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
  )
}
