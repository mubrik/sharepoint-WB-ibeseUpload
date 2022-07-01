/**
* @file Service file for ibeseUpload webpart,
would be better in a class using OOP as i'd call getSP a single time but i like functional approach.
possibly change in the future
* @author Mubrik
*/

// sp object
import { getSP } from "./pnpjs-presets";


export const addFolderByPath = async (folderPath: string) => {
  
    const [sp, docLibName] = getSP();

    try {
      await sp.web.lists.getByTitle(docLibName)
        .rootFolder.addSubFolderUsingPath(folderPath);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
};

export const checkFolderExistInLibraryByPath = async (folderPath: string) => {
    
  const [sp, docLibName] = getSP();

  try {
    const folderAddResult = await sp.web.getFolderByServerRelativePath(`${docLibName}/` + folderPath).select('Exists')();
    return folderAddResult.Exists;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addFileByPath = async (file: File, folderPath: string, fileName: string) => {

  const [sp, docLibName] = getSP();

  try {
    await sp.web.getFolderByServerRelativePath(`${docLibName}/` + folderPath).files.addUsingPath(fileName, file, { Overwrite: true });
    return true;

  } catch (error) {
    console.log(error);
    return false;
  }
};

export const checkIfFileExistByPath = async (filePath: string, fileName:string) => {

  const [sp, docLibName] = getSP();

  try {
    const result = await sp.web.getFolderByServerRelativePath(`${docLibName}/` + filePath).files.getByUrl(fileName).exists();
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getFilesInFolderByPath = async (filePath: string) => {

  const [sp, docLibName] = getSP();

  try {
    const result = await sp.web.getFolderByServerRelativePath(`${docLibName}/` + filePath).files();
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
  
};

export const deleteFileInFolderByPath = async (filePath: string, fileName: string) => {

  const [sp, docLibName] = getSP();

  try {
    await sp.web.getFolderByServerRelativePath(`${docLibName}/` + filePath).files.getByUrl(fileName).delete();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
  
};

interface IUserDetail {
  department: string;
  role: "User" | "Admin";
}

export const getAllUserDetails = async (username: string): Promise<false|IUserDetail> => {

  const [sp, _, usersListName] = getSP();

  if (username === "" || username === undefined) {
    return false;
  }

  try {
    const result = await sp.web.lists.getByTitle(usersListName)
                    .items.select("department", "role","users/Title", "users/EMail", "users/ID")
                    .expand("users").filter(`users/Title eq '${username}'`).top(1)();

    if (result.length > 0) {
      // get sharepoint user details
      const userObj = result[0];
      const { department: departmentName, role: userRole } = userObj;
      // create user object
      const userdata = {
        department: departmentName as string,
        role: userRole as "User" | "Admin",
      }
      return userdata;
    };
    return false;
  }
  catch (error) {
    console.log(error);
    return false;
  }
};

// export const getDocLibraryFolders = async () => {

//   const [sp, docLibName] = getSP();

//   try {
//     const items: any[] = await sp.web.lists.getByTitle(DOCUMENT_LIBRARY_NAME).rootFolder.folders();
//     return items;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

// export const doesFolderExistInLibrary = async (folderName: string) => {

//   const [sp, docLibName] = getSP();

//   try {
//     const items: any[] = await sp.web.lists.getByTitle(DOCUMENT_LIBRARY_NAME).rootFolder.folders();
//     return items.some(item => item.Name === folderName);
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };