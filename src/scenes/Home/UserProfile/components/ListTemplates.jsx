import { templateSettings } from 'lodash';
import React, { useEffect, useState } from 'react';
import { MuiPagination } from '../../../../components/Mui';
import { Block } from '../../Layout';
import '../style.css';

const ListTemplates = ({ templates }) => {
  const [ pageTemplates, setPageTemplates ] = useState(templates.slice(0,2));
  const [ pageNumber, setPageNumber ] = useState(1);

  

  return (
    <div className="template-container">
      <div className="template-list">
      {!!pageTemplates ? pageTemplates.map((template, index) => {
        return (
          <div className="template-card" key={index}>
            <div className="icon-col" style={{backgroundImage: `url(${template.pictureUrl})`}}></div>
            <div className="template-title">{template.name}</div>
          </div>
        );
      }) : null}
      </div>
      <div className="pagination">
      {!!templates && templates.length > 0 ? 
        <MuiPagination
          count={Math.ceil(templates.length/2)}
          shape="round"
          onChange={(event, page)=>{ const pageTemplate = templates.slice(2*(page-1), 2*page);
          setPageTemplates(pageTemplate);
          setPageNumber(page);  }
          }
        />
      : null }
      </div>
    </div>
  );
};

export default ListTemplates;