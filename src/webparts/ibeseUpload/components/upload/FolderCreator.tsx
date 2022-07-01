/**
* Component basically checks if the required folders exist and creates them so 
* that other components can upload files to the correct folder path without worry.
*/
import * as React from 'react';
// service
import {
  addFolderByPath,
  checkFolderExistInLibraryByPath
} from '../../controller/service';
// notification
import {useNotification} from '../notification/NotificationBarContext';
// comps context
import { useUserContext } from '../userContext/userContext';

interface IComponentProps {
  children: React.ReactNode;
}


export default ({ children}: IComponentProps): JSX.Element => {

  // const department = "department"; // placeholder for department
  const { department, role } = useUserContext();

  const [deptExists, setDeptExists] = React.useState<boolean>(false);

  // notify
  const notify = useNotification();

  // effect for creating dept folder
  React.useEffect(() => {
    // dont create folder if role is admin
    if (role === "Admin") {
      return;
    }

    if (department && role) {
      // check if folder exists
      checkFolderExistInLibraryByPath(department)
      .then(res => {
        if(!res) {
          console.log('Dept doesnt exist')
          // create folder
          addFolderByPath(department)
          .then(res => {
            if(res) {
              notify({show: true, msg: "Dept Folder created", type: "success"});
              setDeptExists(true);
            }
          })
        } else {
          setDeptExists(true);
        }
      });
    }
  }, [department, role]);

  // effect for crating year folder in dept folder
  React.useEffect(() => {

    if(deptExists) {
      // check if folder exists
      checkFolderExistInLibraryByPath(department + "/" + new Date().getFullYear())
      .then(res => {
        if(!res) {
          console.log('year doesnt exist')
          // create folder
          addFolderByPath(department + "/" + new Date().getFullYear())
          .then(res => {
            if(res) {
              notify({show: true, msg: "Year Folder created", type: "success"});
            }
          })
        }
      })
    }

  }, [deptExists]);

  return(
    <>
      {children}
    </>
  );

};