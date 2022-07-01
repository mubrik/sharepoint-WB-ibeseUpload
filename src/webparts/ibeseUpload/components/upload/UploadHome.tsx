import * as React from 'react';
// fluent
import { 
  Dropdown, PrimaryButton, 
  Stack, StackItem, IDropdownOption,
  DefaultButton,
  Text
} from 'office-ui-fabric-react';
// service
import { 
  addFileByPath,
  checkIfFileExistByPath
} from '../../controller/service';
// utils
import LoadingButton from '../utils/LoadingButton';
import { useNotification } from '../notification/NotificationBarContext';
//comps custom
import MainList from '../list/MainList';
import { useUserContext } from '../userContext/userContext';

const monthArray = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November',
  'December'
];

export default (): JSX.Element => {

  // selected dropdown
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [listLoadingStatus, setListLoadingStatus] = React.useState<"idle"|"loaded">("idle");

  // notify
  const notify = useNotification();

  // const department = "department"; // placeholder for department
  const { department } = useUserContext();

  const fileUploadProperties = React.useMemo(() => {

    if (!selectedItem || attachedFiles.length === 0) {
      return {
        fileName: "",
        folderPath: ""
      }
    }

    // get file extension
    const fileExtension = attachedFiles[0].name.split('.').pop();

    // file name is always selected month
    const fileName = selectedItem.text + '.' +fileExtension;

    // get current year
    const currentYear = new Date().getFullYear();

    return {
      fileName: `${fileName}`,
      folderPath: `${department}/${fileName === "December" ? currentYear - 1 : currentYear}`
    }
  }, [selectedItem, attachedFiles]);

  // effect for checking file exists
  React.useEffect(() => {
    if(attachedFiles.length > 0 && selectedItem) {

      checkIfFileExistByPath(fileUploadProperties.folderPath, fileUploadProperties.fileName)
      .then(res => {
        if (res) {
          notify({
            show: true, 
            msg: `File ${fileUploadProperties.fileName} already exist and will be overwritten`, 
            type: 'info'
          });
        }
      })
    }
  }, [selectedItem, attachedFiles, fileUploadProperties]);


  const uploadFileToSp = async () => {

    if (attachedFiles.length > 0 && selectedItem) {
      
      const {fileName, folderPath} = fileUploadProperties;
  
      console.log(fileName, folderPath);
      console.log(selectedItem, attachedFiles)
      // loading
      setIsUploading(true);
      // upload file
      try {
        const result = await addFileByPath(attachedFiles[0], folderPath, fileName);
        // notify
        if (result) {
          notify({show: true, msg: 'File uploaded successfully', type: 'success'});
          setListLoadingStatus("idle");
          setAttachedFiles([]);
        } else {
          notify({show: true, msg: 'File upload failed', type: 'error'});
        }
      } catch (error) {
        console.log(error);
          // notify
        notify({show: true, msg: 'File upload failed', type: 'error'});
      } finally { 
        setIsUploading(false);
      }
    }

  };

  return(
    <Stack tokens={{ childrenGap: 8, padding: 4}}>
      <Stack tokens={{ childrenGap: 8, padding: 4}}
        horizontal
        horizontalAlign={"space-between"}
        verticalAlign={"center"}
      >
        <StackItem>
          <DropdownComponent selectedItem={selectedItem} setSelectedItem={setSelectedItem} fileUploadProps={fileUploadProperties}/>
        </StackItem>
        <AddFileComponent files={attachedFiles} setFiles={setAttachedFiles}/>
      </Stack>
      <Stack>
        <StackItem>
          <LoadingButton
            loading={isUploading}
            loadingMsg="Uploading..."
            variant='primary'
            disabled={attachedFiles.length === 0 || !selectedItem}
            onClick={() => uploadFileToSp()}> Upload to Sharepoint </LoadingButton>
        </StackItem>
      </Stack>
      <Stack>
        <MainList loadingStatus={listLoadingStatus} setLoadingStatus={setListLoadingStatus}/>
      </Stack>
    </Stack>
  );
};

interface IAddFileProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const AddFileComponent = ({files, setFiles}:IAddFileProps):JSX.Element => {

  const stackRef = React.useRef<HTMLDivElement>(null);

  const handleAddFileClick = (): void => {

    const input = document.getElementById("fileDocUpload");

    if (input) {
      input.click();
    }
  };

  const handleAddFile = (event: any, eventSource:"click"|"drop"="click"): void => {
    event.stopPropagation();
    event.preventDefault();

    console.log("adding file");

    const fileList: FileList = eventSource === "click" ? event.target.files : event.dataTransfer.files as React.DragEvent;
    // add notes
    const filesArr = Array.from(fileList);
    // set new
    setFiles(filesArr);

    console.log(filesArr);
  };

  const dragenter = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const dragover = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDrop = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    handleAddFile(event, "drop");
  };

  const divStyle: React.CSSProperties = React.useMemo(() => ({
    border: '1px dashed rgb(146 179 217)',
    borderRadius: 5,
    padding: '10px',
    width: '80%',
    height: '100%',
    display: 'flex',
    flexDirection: "column"
  }), []);

  // add event listeners
  React.useEffect(() => {
    if (stackRef.current) {
      stackRef.current.addEventListener("dragenter", dragenter);
      stackRef.current.addEventListener("dragover", dragover);
      stackRef.current.addEventListener("drop", onDrop);
    }

    // on unmount, remove event listeners
    return (): void => {
      if (stackRef.current) {
        stackRef.current.removeEventListener("dragenter", dragenter);
        stackRef.current.removeEventListener("dragover", dragover);
        stackRef.current.removeEventListener("drop", onDrop);
      }
    }
  }, []);

  return(
    <div ref={stackRef} style={divStyle}>
      <Text style={{ margin: "0px 0px 8px 8px"}}> Drag and Drop File to upload here or use button below</Text>
      <Stack tokens={{ childrenGap: 8 }} horizontal horizontalAlign={"start"} >
        <input type="file" id="fileDocUpload" accept={'.xls,.xlsx'} style={{ display: "none"}} onChange={(e) => handleAddFile(e)}/>
        <PrimaryButton htmlFor="fileElem" onClick={handleAddFileClick}>Add File</PrimaryButton>
        <DefaultButton onClick={() => setFiles([])} disabled={files.length === 0}> Clear File </DefaultButton>
      </Stack>
    </div>
  );
};

interface IDropdownProps {
  selectedItem: IDropdownOption;
  setSelectedItem: React.Dispatch<React.SetStateAction<IDropdownOption>>;
  fileUploadProps: {fileName: string, folderPath: string};
}

const DropdownComponent = ({selectedItem, setSelectedItem, fileUploadProps}:IDropdownProps):JSX.Element => {

  const monthDropdownOptions = React.useMemo((): IDropdownOption[] => {
    // get current month
    const currentMonth = new Date().getMonth();
    const prevMonth = currentMonth !== 0 ? currentMonth - 1 : 11;
    const monthBefore = prevMonth !== 0 ? prevMonth - 1 : 11;

    // return options
    return [
      { key: monthArray[prevMonth], text: monthArray[prevMonth] },
      { key: monthArray[monthBefore], text: monthArray[monthBefore] },
    ] 
  }, []);

  const handeDropdownChange = React.useCallback((event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setSelectedItem(item);
  } ,[])

  return(
    <Dropdown
      label='Select Month to Upload for'
      options={monthDropdownOptions}
      onChange={handeDropdownChange}
    />
  );
};