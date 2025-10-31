import { create } from "zustand";

export const useFooterStore = create<FooterStoreType>(set => ({
    isFetching: false,
    approve: false,
    focused: false,
    payeeCard: false,
    buttonCallback: () => {},
    hideRequisite: false,
    isUnicalization: false,
    buttonCaption: "",
    nextPage: "",
    showCancelBtn: true,
    prevPage: "",
    nextEnabled: true,
    noIcon: false,

    setFooter: (data: FooterData) => set(state => ({ ...state, ...data })),

    reset: () =>
        set({
            buttonCaption: "",
            nextPage: "",
            showCancelBtn: false,
            prevPage: "",
            nextEnabled: true,
            approve: false,
            focused: false,
            payeeCard: false,
            noIcon: false,
            buttonCallback: () => {},
            hideRequisite: false,
            isUnicalization: false
        })
}));
