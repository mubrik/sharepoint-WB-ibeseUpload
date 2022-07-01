import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import * as strings from 'IbeseUploadWebPartStrings';
// Root component for the webpart
import IbeseUpload from './components/IbeseUpload';
// function to get SP to be initialized
import { getSP } from './controller/pnpjs-presets';

export interface IIbeseUploadWebPartProps {
  description: string;
  documentLibraryName: string;
  usersListName: string;
  webpartContext: WebPartContext;
}

export default class IbeseUploadWebPart extends BaseClientSideWebPart<IIbeseUploadWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIbeseUploadWebPartProps> = React.createElement(
      IbeseUpload,
      {
        description: this.properties.description,
        documentLibraryName: this.properties.documentLibraryName,
        usersListName: this.properties.usersListName,
        webpartContext: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected async onInit(): Promise<void> {  
    super.onInit();
  
    // Initialize our _sp object that we can then use in other packages without having to pass around the context.
    getSP(this.context, 
      this.properties.documentLibraryName,
      this.properties.usersListName
    );
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('documentLibraryName', {
                  label: strings.DocumentLibraryFieldLabel
                }),
                PropertyPaneTextField('usersListName', {
                  label: strings.UsersListFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected get disableReactivePropertyChanges(): boolean {
    // so that we don't need to rerender the webpart when we change the description property
    // refresh instead of rerendering the webpart
    return true;
  }
}
