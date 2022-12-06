import {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogTailwindCSS,
  openAboutSidebar,
} from './ui';

import { getSheetsData, addSheet, deleteSheet, setActiveSheet,setData,getData } from './sheets';

// Public functions must be exported as named exports
export {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogTailwindCSS,
  openAboutSidebar,
  getData,
  getSheetsData,
  addSheet,
  deleteSheet,
  setActiveSheet,
  setData,
};
