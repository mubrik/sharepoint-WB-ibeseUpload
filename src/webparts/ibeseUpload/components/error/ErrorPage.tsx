import * as React from "react";
// fluent
import {
  Stack, FontIcon,
  Text
} from "office-ui-fabric-react";


interface IComponentProps {
  errorMsgTitle?: string;
  errorMsgDetail?: string;
};

/**
* @description Renders a fancy error message
* @param IComponentProps
* @returns Error page to render
*/
const ErrorPage = ({ errorMsgDetail, errorMsgTitle }: IComponentProps): JSX.Element => {

  return(
    <Stack tokens={{ childrenGap: 8 }} horizontalAlign={"center"} grow verticalFill>
      <Stack tokens={{ childrenGap: 8 }} verticalAlign={"center"} horizontal>
        <Text variant={"xLarge"}> Error </Text>
        <FontIcon iconName={"Error"} style={{ color: "red", fontSize: "1rem"}}/>
      </Stack>
      <Stack tokens={{ childrenGap: 8 }} verticalAlign={"center"} horizontal>
        <Text variant={"medium"}> {errorMsgTitle ? errorMsgTitle : "" } </Text>
        <FontIcon iconName={"BlockedSiteSolid12"} style={{ color: "red", fontSize: "1rem"}}/>
      </Stack>
      <Stack tokens={{ childrenGap: 8 }} verticalAlign={"center"} horizontal>
        <Text variant={"smallPlus"}> {errorMsgDetail ? errorMsgDetail : "" } </Text>
      </Stack>
    </Stack>
  );
};

export default ErrorPage;