import React from 'react';
import { Block } from '../../Home/Layout';
import { sequenceGraph2 } from 'assets/img';
import { Button } from 'semantic-ui-react';
import CircleFacebookIcon from "assets/images/icon-facebook-circle.svg";
import CircleInstagramIcon from "assets/images/icon-instagram-circle.svg";
import "./TemplateCard.scss";
const TemplateCard = ({ item, index, buttonText, onButtonClick, sourceIconVisible }) => {
  const handleButtonClick = () => {
    onButtonClick(item);
  };
  return (
    <Block className={`template-card-item-container default item blue`} onClick={handleButtonClick}>
      <Block className="choose-sequence-inner">
        {sourceIconVisible && <Block className="img-template-source-icon">
            {item.source === "fb" && (
                <img
                    src={
                        CircleFacebookIcon
                    }
                />
            )}
            {item.source === "ig" && (
                <img
                    src={
                        CircleInstagramIcon
                    }
                />
            )}
        </Block>}
        <Block className="icon-col template-cover-image">
          <img src={item.pictureUrl || sequenceGraph2} size='full' className='graph' />
          <div className="template-ratio"></div>
        </Block>
        <h3 className="sq-title">
          {item.name}
        </h3>
        <h4 className="sq-description">
          {item.description}
        </h4>
        {/* <Block className="button-col">
          <Button className="ui primary button">
            {buttonText}
          </Button>
        </Block> */}
      </Block>
    </Block>
  );
};

export default TemplateCard;