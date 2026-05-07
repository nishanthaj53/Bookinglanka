import { create } from "zustand";

const useStore = create((set) => ({
  searchPopupStatus: false,
  mobileDrawerStatus: false,
  mobileDrawerTwoStatus: false,
  sideBarDrawerStatus: false,

  changeSearchPopupStatus: () =>
    set((state) => ({
      searchPopupStatus: !state.searchPopupStatus,
    })),

  changeMobileDrawerStatus: () =>
    set((state) => {
      const newStatus = !state.mobileDrawerStatus;
      console.log("mobileDrawerStatus changed to:", newStatus);
      return { mobileDrawerStatus: newStatus };
    }),

  changeMobileDrawerTwoStatus: () =>
    set((state) => {
      const newStatus = !state.mobileDrawerTwoStatus;
      console.log("mobileDrawerTwoStatus changed to:", newStatus);
      return { mobileDrawerTwoStatus: newStatus };
    }),

  changeSideBarDrawerStatus: () =>
    set((state) => ({
      sideBarDrawerStatus: !state.sideBarDrawerStatus,
    })),

  setMobileDrawerTwoStatus: (status) =>
    set(() => ({
      mobileDrawerTwoStatus: status,
    })),

  setMobileDrawerStatus: (status) =>
    set(() => ({
      mobileDrawerStatus: status,
    })),

  setSideBarDrawerStatus: (status) =>
    set(() => ({
      sideBarDrawerStatus: status,
    })),
}));

export default useStore;
