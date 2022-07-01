/**
* @file userContext.tsx - Fetches the permitted user list and cretaes a context for department and user.
*/
import * as React from 'react';
// components
import ErrorPage from '../error/ErrorPage';
// utils
import createTypeContext from '../utils/createContext';
// service
import { getAllUserDetails } from '../../controller/service';
// webpart
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IUserContext {
  department: string;
  displayName: string;
  role: "User" | "Admin";
}

const baseUserContextObj: IUserContext = {
  department: "",
  displayName: "",
  role: "User"
};
// create context
const [useUserContext, UserContextProvider] = createTypeContext<IUserContext>("userContext");

// component
interface IComponentProps {
  children: React.ReactNode;
  webpartContext: WebPartContext;
}

export default ({ children, webpartContext }: IComponentProps): JSX.Element => {

  const displayName = webpartContext.pageContext.user.displayName;

  const [userContext, setUserContext] = React.useState<IUserContext>(baseUserContextObj);
  const [isUserPermitted, setIsUserPermitted] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // effect to get user details
  React.useEffect(() => {
    // set loading
    setIsLoading(true);
    // get user details
    getAllUserDetails(displayName)
      .then(result => {
        if (result) {
          const { department, role } = result;
          setIsUserPermitted(true);
          setUserContext({
            department,
            role,
            displayName: displayName
          });
          return;
        }
        // length of result is 0
        setIsUserPermitted(false);
      }).catch(err => {
        setIsUserPermitted(false);
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  return(
    <UserContextProvider value={userContext}>
      {
        isLoading ?
          <div>Loading...</div> :
        !isLoading && isUserPermitted ?
          children :
        !isLoading && !isUserPermitted ?
          <ErrorPage 
            errorMsgTitle='Permission Error'
            errorMsgDetail={`
            You are not permitted to access this Web App.
            Please contact the administrator of this Web App or
            Check the users list on deployed site
            `}
          /> :
          <ErrorPage 
            errorMsgTitle='Error'
            errorMsgDetail='Something went wrong, contact IT support.'
          /> 
      }
    </UserContextProvider>
  );
};

export {useUserContext};
