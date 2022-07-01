import * as React from 'react';
// fluent
import { 
  Stack, Text, StackItem, PrimaryButton
} from 'office-ui-fabric-react';
// utils
import { useNotification } from '../notification/NotificationBarContext';
import { useUserContext } from '../userContext/userContext';
// service
import { 
  getFilesInFolderByPath, deleteFileInFolderByPath
} from '../../controller/service';


// list item style
const listItemStyle: React.CSSProperties = {
  padding: "6px",
  marginTop: "6px",
  boxShadow: "rgb(0 0 0 / 20%) -2px 1px 4px 1px",
  borderRadius: "8px",
  alignItems: "center"
};

const monthArray = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November',
  'December'
];

interface IComponentProps {
  loadingStatus: "idle" | "loaded";
  setLoadingStatus: React.Dispatch<React.SetStateAction<"idle" | "loaded">>;
}

export default ({loadingStatus, setLoadingStatus}: IComponentProps): JSX.Element => {

  const [fileList, setFileList] = React.useState<string[]|[]>([]);
  // const [loadingStatus, setLoadingStatus] = React.useState<"idle"|"loaded">("idle");
  // implement dropdown to select year of folder later on

  // notify
  const notify = useNotification();

  // const department = "department"; // placeholder for department
  const { department, role } = useUserContext();

  React.useEffect(() => {

    if (loadingStatus === "idle") {
      // get current year
      const currentYear = new Date().getFullYear();
  
      const folderPath = `${department}/${currentYear}`
  
      getFilesInFolderByPath(folderPath)
        .then(res => {
          if (res) {
            setFileList(res.map(file => file.Name));
          }
        })
        .finally(() => setLoadingStatus("loaded"));
    }

  }, [loadingStatus]);

  const onDeleteClick = async (fileName: string) => {
    // confirm delete
    const confirm = window.confirm(`Are you sure you want to delete ${fileName}?`);
    
    if (!confirm) { 
      return;
    };

    // verify if fileName
    if (fileName === "" || fileName === undefined) {
      notify({show: true, msg: "Error deleting file, Contact IT support", type: "error"});
      return;
    };

    // get month name from file name
    const monthName = fileName.split('.')[0];
    // get month index
    const monthIndex = monthArray.indexOf(monthName);
    // get assumed date from month index
    const monthDate = new Date(new Date().getFullYear(), monthIndex, 1);
    // get current date
    const currentDate = new Date();
    // get difference between current date and month date
    const difference = currentDate.getTime() - monthDate.getTime();
    // get difference in days
    const differenceInDays = Math.floor(difference / (1000 * 3600 * 24));
    // since i'm starting for first of each month of index, i'm accomodating for that adding 30days
    // if difference in days is greater than 45, disable delete. if admin, delete file
    console.log(differenceInDays);
    if (differenceInDays > 45 && role !== "Admin") {
      notify({show: true, msg: "File cannot be deleted, it is more than 15 days uploaded. Contact Admin", type: "error"});
      return;
    };


    try {
      const res = await deleteFileInFolderByPath(`${department}/${new Date().getFullYear()}`, `${fileName}`);

      if (res) {
        // notify success
        notify({show: true, msg: "File deleted", type: "success"});
        setLoadingStatus("idle");
      }
      
    } catch (error) {
      console.log(error);
      // notify error
      notify({show: true, msg: "Error deleting file", type: "error"});
    }


  };

  return(
    <Stack tokens={{ childrenGap: 8 }}>
      <StackItem>
        <Text> List of uploaded sheets for {department} department in current year: </Text>
      </StackItem>
      <Stack>
        {
          fileList.map(fileName => {
            return(
              <Stack horizontal horizontalAlign={"space-between"} tokens={{ childrenGap: 8 }} style={listItemStyle}>
                <Text>{fileName}</Text>
                <PrimaryButton onClick={() => onDeleteClick(fileName)}> Delete </PrimaryButton>
              </Stack>
            );
          })
        }
      </Stack>
    </Stack>
  );
};