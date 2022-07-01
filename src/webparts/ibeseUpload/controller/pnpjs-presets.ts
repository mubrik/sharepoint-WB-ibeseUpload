import { WebPartContext } from "@microsoft/sp-webpart-base";

// import pnp, pnp logging system, and any other selective imports needed
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/batching";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/files/folder";

let _sp: SPFI = null;
let _documentLibraryName = "";
let _usersListName = "";

export const getSP = (context?: WebPartContext, docLibName?:string, usersListName?: string): [SPFI, string, string] => {
  if (_sp === null && context != null) {
    // initialization call
    // You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
    // The LogLevel set's at what level a message will be written to the console
    console.log(docLibName, usersListName);
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
    _documentLibraryName = docLibName;
    _usersListName = usersListName;
  }
  return [_sp, _documentLibraryName, _usersListName];
};
