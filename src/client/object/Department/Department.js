import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
  // NEED getDepartmentFields,
  getObjectByDepartment,
} from '../../../waivioApi/ApiClient';

import './Department.less';

const Department = ({ wobject, departments, isEditMode, history }) => {
  let skip = 0;
  const limit = 30;
  const [activeDepartment, setActiveDepartment] = useState({});
  // NEED  const [wobjectsList, setWobjectsList]= useState([])
  const getDepartmentsClassNames = element =>
    classNames({ Department__activeDepartment: element.body === activeDepartment.body });

  const onDepartmentClick = department => {
    history.push(`/object/${wobject.author_permlink}/departments/${department.body}`);
    getObjectByDepartment({ departments: [department.body], skip, limit }).then(r => {
      // NEED setWobjectsList(r.wobjects)
      if (r.hasMore) {
        skip = r.wobjects.length;
        getObjectByDepartment({ departments: [department.body], skip, limit });
        // NEED setWobjectsList(r.wobjects)
      }
    });

    setActiveDepartment(department);
    // NEED getDepartmentFields({names:[department.body]}).then(res=>console.log(res))
  };

  const departmentsList = departments
    .map(d => (
      <div key={d.body}>
        <button className="CompanyId__button" onClick={() => onDepartmentClick(d)}>
          <span className={getDepartmentsClassNames(d)}>{d.body}</span>
        </button>
        {d.body === activeDepartment.body ? <div className="pl1">ACTIVE DEP</div> : null}
      </div>
    ))
    .slice(0, 7);

  return (
    <div className="flex-column">
      {!isEditMode && (
        <>
          <FormattedMessage id="departments" formattedMessage="Departments" />:{' '}
        </>
      )}
      <div className="Department__container ">{departmentsList}</div>
    </div>
  );

  // ?????????????????????????????????????????????????????????????????????????????????????????
  //  const rootSubmenuKeys = departments.map(d=> d.body);
  //  const [openKeys, setOpenKeys]= useState( [])
  //  const [activeDep, setActiveDep]=useState({})
  //  const [excludedDeps, setExcludedDeps]=useState([])
  //
  //  const mockedSubmenus = [{body:1},{body:2},{body:3},]
  // const  onOpenChange = keys => {
  //    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
  //
  //    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //      setOpenKeys(keys);
  //    } else {
  //    setOpenKeys( latestOpenKey ? [latestOpenKey] : []);
  //    }
  //
  //  };
  //  const onSubmenuClick=(key)=>{
  //    getDepartmentFields({names: [key.key]})
  //      .then(res =>{
  //        setActiveDep(res[0])
  //        setExcludedDeps([res[0].name])
  //      })
  //  }
  //
  //  console.log(activeDep, 'activeDep')
  //  console.log(excludedDeps, ' excludedDeps')
  //  return (
  //      <div className='flex-column'>
  //        {!isEditMode &&  <><FormattedMessage id='departments' formattedMessage='Departments'/>:{' '}</>}
  //        <div className="Department__container ">
  //           <Menu
  //             mode="inline"
  //             openKeys={openKeys}
  //             onOpenChange={onOpenChange}
  //             style={{ width: 170, border:"none"}}
  //
  //           >
  //             {departments.map(d=>
  //               <SubMenu
  //                 onTitleClick={onSubmenuClick}
  //               key={d.body}
  //             title={
  //                 <span>
  //              <span>{d.body}</span>
  //            </span>
  //               }
  //             >
  //                 {activeDep?
  //                   <Menu
  //                     mode="inline"
  //                     openKeys={openKeys}
  //                     onOpenChange={onOpenChange}
  //                     style={{ width: 170, border:"none"}}
  //                   >
  //                     {mockedSubmenus.map(dep=>
  //                       <SubMenu
  //                         onTitleClick={onSubmenuClick}
  //                         key={dep.body}
  //                         title={
  //                           <span>
  //              <span>{dep.body}</span>
  //            </span>
  //                         }
  //                        />)}
  //                   </Menu>
  //                   : <MenuItem> No fields for {activeDep.name}</MenuItem>
  //                 }
  //             </SubMenu>)}
  //
  //           </Menu>
  //        </div>
  //        </div>
  //    );
  // ?????????????????????????????????????????????????????????????????????????????????????????
};

Department.propTypes = {
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default Department;
