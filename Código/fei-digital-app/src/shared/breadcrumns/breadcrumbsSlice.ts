import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface RoutePage {
  name: string;
  url: string;
}

export interface LinkContext {
  links: RoutePage[];
}

const initialState: LinkContext = {
  links: [{ name: "Inicio", url: "/home" }],
};

export const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    addPage: (state, action: PayloadAction<RoutePage>) => {
      const list = state.links;
      const replaceList: Array<RoutePage> = [];
      if (list[list.length - 1].url !== action.payload.url) {
        list.forEach((link) => {
          if (link.url !== action.payload.url) replaceList.push(link);
        });
        if (replaceList.length > 4) replaceList.shift();
        replaceList.push(action.payload);
        state.links = replaceList;
      }
    },
    setPage: (state, action: PayloadAction<RoutePage>) => {
      state.links = [action.payload];
    },
  },
});

export const { addPage, setPage } = breadcrumbSlice.actions;
export const selectBreadcrumbLinks = (state: RootState) =>
  state.breadcrumb.links;
export default breadcrumbSlice.reducer;
