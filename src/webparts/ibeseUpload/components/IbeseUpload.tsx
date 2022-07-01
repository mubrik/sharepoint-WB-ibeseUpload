import * as React from 'react';
// custom
import UploadHome from '../components/upload/UploadHome';
import ErrorPage from './error/ErrorPage';
import ErrorBoundary from './error/ErrorBoundary';
// contexts
import NotificationBarContext from './notification/NotificationBarContext';
import DialogContext from './dialog/DialogContext';
import FolderCreator from './upload/FolderCreator';
import UserContext from './userContext/userContext';
// types
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IComponentProps {
  description: string;
  documentLibraryName: string;
  usersListName: string;
  webpartContext: WebPartContext;
}

export default ({ 
  documentLibraryName, webpartContext, usersListName}: IComponentProps
): JSX.Element => {
  
  console.log(`doclibraryName: ${documentLibraryName} userlistName: ${usersListName}`);
  // webpart width
  React.useEffect(() => {
    try {

      const bench = document.getElementById("workbenchPageContent");
      const canvas = document.getElementsByClassName("CanvasZone--controlSelected")[0] as HTMLElement;
      const control = document.getElementsByClassName("CanvasZone")[0] as HTMLElement;

      if (control) {
        control.style.maxWidth = "100%";
        // control.style.maxWidth = "1920px";
      }

      if (bench) {
        bench.style.maxWidth = "1920px";
      }
      
      if (canvas) {
        canvas.style.maxWidth = "1920px";
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return(
    <>
    {
      // check document library name and user list name is configured
      (documentLibraryName !== "" && usersListName !== "") ?
      <ErrorBoundary>
      <UserContext webpartContext={webpartContext}>
      <NotificationBarContext>
      <DialogContext>
      <FolderCreator>
        <UploadHome/>
      </FolderCreator>
      </DialogContext>
      </NotificationBarContext>
      </UserContext>
      </ErrorBoundary>
      :
      <ErrorPage 
        errorMsgTitle="Webpart Error" 
        errorMsgDetail="Please configure the document library and users list in the Web App Properties"
      />
    }
    </>
  );
};
